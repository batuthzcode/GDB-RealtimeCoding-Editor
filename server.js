const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());
app.use(express.static('public'));

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    transports: ['polling', 'websocket']
});

// SİBER GÜVENLİK NOTU: API anahtarlarını kodun içine yazmıyoruz. 
// Canlıda kullanırken process.env üzerinden veya .env dosyasından çekmelisin.
const GROQ_API_KEY = "YOUR_GROQ_API_KEY_HERE"; 

// --- 1. AI DÜZELTME ROTASI ---
app.post('/ai-fix', async (req, res) => {
    try {
        const prompt = "Sen bir kod düzeltme asistanısın. SADECE düzeltilmiş kodu döndür. Açıklama yapma, Markdown kullanma:\n\n" + req.body.code;
        
        if (GROQ_API_KEY === "YOUR_GROQ_API_KEY_HERE") {
            return res.status(500).json({ error: "API Key eksik!" });
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }]
            })
        });
        const data = await response.json();
        let text = data.choices[0].message.content.trim();
        text = text.replace(/```[a-z]*\n/gi, '').replace(/```/g, '').trim();
        res.json({ fixedCode: text });
    } catch (err) {
        res.status(500).json({ error: "AI hatası", details: err.message });
    }
});

// --- 2. KOD DERLEME (GLOT.IO GÜNCEL) ---
app.post('/compile', async (req, res) => {
    try {
        const { script, language, stdin } = req.body;
        
        // SİBER GÜVENLİK NOTU: Token bilgisini sildik.
        const GLOT_TOKEN = "YOUR_GLOT_TOKEN_HERE"; 

        const glotLangs = { 
            'python3': 'python', 
            'csharp': 'csharp', 
            'cpp': 'cpp', 
            'nodejs': 'javascript', 
            'java': 'java', 
            'go': 'go', 
            'php': 'php' 
        };
        
        const fileNames = {
            'python3': 'main.py',
            'csharp': 'main.cs',
            'cpp': 'main.cpp',
            'nodejs': 'main.js',
            'java': 'Main.java',
            'go': 'main.go',
            'php': 'main.php'
        };

        const lang = glotLangs[language] || 'python';
        const fileName = fileNames[language] || 'main.py';

        if (GLOT_TOKEN === "YOUR_GLOT_TOKEN_HERE") {
            return res.json({ output: "Sistem Hatası: Derleyici Tokenı eksik." });
        }

        const response = await fetch(`https://glot.io/api/run/${lang}/latest`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Token ${GLOT_TOKEN}` 
            },
            body: JSON.stringify({
                files: [{ name: fileName, content: script }],
                stdin: stdin || ""
            })
        });

        const data = await response.json();
        
        let output = "";
        if (data.stdout) output += data.stdout;
        if (data.stderr) output += "\n❌ HATA:\n" + data.stderr;
        if (data.error) output += "\n⚠️ SİSTEM HATASI:\n" + data.error;

        res.json({ output: output.trim() || "Kod çalıştırıldı ama bir çıktı üretilmedi." });

    } catch (error) {
        console.error("Glot.io Bağlantı Hatası:", error);
        res.status(500).json({ output: "❌ Derleyici sunucusuna ulaşılamadı." });
    }
});

// --- 3. SOCKET.IO SİSTEMİ ---
const usersInRooms = {};
io.on('connection', (socket) => {
    socket.on('join-room', (data) => {
        const { roomId, username } = data;
        socket.join(roomId);
        if (!usersInRooms[roomId]) usersInRooms[roomId] = [];
        usersInRooms[roomId].push({ id: socket.id, name: username || "Misafir" });
        io.in(roomId).emit('user-list-update', usersInRooms[roomId]);
    });
    socket.on('code-update', (data) => {
        if (data.roomId) socket.to(data.roomId).emit('code-sync', data.code);
    });
    socket.on('disconnecting', () => {
        socket.rooms.forEach(roomId => {
            if (usersInRooms[roomId]) {
                usersInRooms[roomId] = usersInRooms[roomId].filter(u => u.id !== socket.id);
                io.in(roomId).emit('user-list-update', usersInRooms[roomId]);
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Sunucu aktif: Glot.io & Groq AI hazır!`);
});
