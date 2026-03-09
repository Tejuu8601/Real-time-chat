const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = 5000;

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

let messages = []; // Store chat history

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send message history to new client
  ws.send(JSON.stringify({ type: 'history', data: messages }));

  ws.on('message', (msg) => {
    const message = JSON.parse(msg);
    messages.push(message);

    // Broadcast message to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'message', data: message }));
      }
    });
  });

  ws.on('close', () => console.log('Client disconnected'));
});