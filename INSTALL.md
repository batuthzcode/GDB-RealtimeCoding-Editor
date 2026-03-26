🇺🇸 English Setup Guide (cPanel / Web Hosting)

Follow these steps to deploy the project directly to your web hosting environment:

Upload Files:

Log in to your hosting control panel (cPanel/Plesk, etc.) and open the File Manager.

Upload all project files (index.html, server.js, derle.php, package.json) to your root directory (usually public_html).

Setup Node.js App:

Navigate to the "Setup Node.js App" section in your hosting panel.

Create a new application and set the Startup file to server.js.

Once created, click the "Run NPM Install" button in the panel to automatically install the required libraries (Express, Socket.io).

Get and Insert API Keys:

AI Assistant (Groq): Get a free API key from the Groq Console and insert it into server.js.

Code Compiler (JDoodle/Glot): Get your API tokens for the respective compiler service and place them in server.js (or derle.php).

Start the Project:

Click the "Start App" button in your Node.js settings. Your site is now live with real-time Socket connections and AI support!
------------------------------------------------------------------
🛠 Web Sitesine Kurulum / Hosting Deployment
🇹🇷 Türkçe Kurulum Rehberi (cPanel / Web Hosting)

Bu projeyi doğrudan web sitenizde (hosting üzerinde) çalıştırmak için aşağıdaki adımları izleyin:

Dosyaları Yükleyin: * Hosting panelinize (cPanel/Plesk vb.) giriş yapın ve Dosya Yöneticisini açın.

Projedeki tüm dosyaları (index.html, server.js, derle.php, package.json) ana dizine (genellikle public_html) yükleyin.

Node.js Uygulamasını Başlatın:

Hosting panelinizden "Setup Node.js App" (Node.js Uygulaması Kur/Yapılandır) menüsüne girin.

Yeni bir uygulama oluşturun. Başlangıç dosyası (Startup file) olarak server.js yazın.

Uygulamayı oluşturduktan sonra paneldeki "NPM Install" butonuna basarak gerekli kütüphaneleri (Express, Socket.io) otomatik olarak kurun.

API Anahtarlarını Alın ve Ekleyin:

Yapay Zeka (Groq): Groq Console üzerinden ücretsiz API anahtarı alın ve server.js içindeki ilgili yere ekleyin.

Kod Derleyici (JDoodle/Glot): Sistemin kullandığı derleyiciye göre API anahtarlarınızı alın ve server.js (veya derle.php) içindeki güvenli alanlara yerleştirin.

Projeyi Başlatın:

Node.js panelinden "Start App" (Uygulamayı Başlat) butonuna tıklayın. Siteniz artık gerçek zamanlı Socket bağlantıları ve yapay zeka desteğiyle canlıda!
