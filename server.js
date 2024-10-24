const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public')); // Serve arquivos estáticos da pasta 'public'

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
    const data = JSON.parse(message);
    const deviceId = data.deviceId;
    const lon = data.lon;
    const lat = data.lat;
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ deviceId, lon, lat }));
      }
    });
  });
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
