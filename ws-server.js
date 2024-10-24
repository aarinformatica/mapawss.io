const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Handle incoming messages from clients
  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
    // Process the message and send the updated location to all connected clients
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

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
