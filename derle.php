<?php
header('Content-Type: application/json');

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

// --- API ANAHTARLARI HAVUZU ---
// SİBER GÜVENLİK NOTU: Gerçek clientId ve clientSecret bilgileri güvenlik nedeniyle kaldırılmıştır.
// Canlı sistemde bu bilgileri ortam değişkenlerinden (Environment Variables) çekmek daha güvenlidir.
$apiKeys = [
    [
        'clientId' => 'YOUR_JDOODLE_CLIENT_ID_1',
        'clientSecret' => 'YOUR_JDOODLE_CLIENT_SECRET_1'
    ],
    [
        'clientId' => 'YOUR_JDOODLE_CLIENT_ID_2',
        'clientSecret' => 'YOUR_JDOODLE_CLIENT_SECRET_2'
    ]
];

// Havuzdan rastgele bir anahtar seçiyoruz (Yük Dengeleme Mantığı)
$randomKey = $apiKeys[array_rand($apiKeys)];
$clientId = $randomKey['clientId'];
$clientSecret = $randomKey['clientSecret'];

// Eğer anahtarlar girilmemişse hata döndür
if ($clientId === 'YOUR_JDOODLE_CLIENT_ID_1') {
    echo json_encode(['output' => 'Sistem Hatası: API Anahtarları yapılandırılmamış.']);
    exit;
}

$script = $input['script'] ?? '';
$language = $input['language'] ?? 'python3';
$stdin = $input['stdin'] ?? '';

$data = array(
    'clientId' => $clientId,
    'clientSecret' => $clientSecret,
    'script' => $script,
    'stdin' => $stdin,
    'language' => $language,
    'versionIndex' => "0"
);

$ch = curl_init('https://api.jdoodle.com/v1/execute');
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Content-Length: ' . strlen(json_encode($data))
));

$result = curl_exec($ch);
curl_close($ch);

echo $result;
?>
