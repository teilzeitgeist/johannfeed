<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$tokenFile = __DIR__ . '/instagram-token.json';

// GET: Token abrufen
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($tokenFile)) {
        $data = json_decode(file_get_contents($tokenFile), true);
        echo json_encode(['token' => $data['token'] ?? '']);
    } else {
        echo json_encode(['token' => '']);
    }
    exit;
}

// POST: Token aktualisieren (mit Passwortschutz)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Passwort prüfen (BITTE ÄNDERN!)
    $correctPassword = 'Nice Try'; // TODO: Dieses Passwort ändern!
    
    if (!isset($input['password']) || $input['password'] !== $correctPassword) {
        http_response_code(401);
        echo json_encode(['error' => 'Falsches Passwort']);
        exit;
    }
    
    if (!isset($input['token'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Token fehlt']);
        exit;
    }
    
    $data = [
        'token' => $input['token'],
        'updated' => date('Y-m-d H:i:s')
    ];
    
    file_put_contents($tokenFile, json_encode($data, JSON_PRETTY_PRINT));
    echo json_encode(['success' => true, 'message' => 'Token erfolgreich aktualisiert']);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Methode nicht erlaubt']);
