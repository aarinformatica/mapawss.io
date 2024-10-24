// Obter a localização atual do dispositivo
navigator.geolocation.getCurrentPosition(position => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  // Criar o mapa
  const map = L.map('map').setView([lat, lon], 13);

  // Adicionar o marcador
  const marker = L.marker([lat, lon]).addTo(map);

  // Adicionar a camada do OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    subdomains: ['a', 'b', 'c']
  }).addTo(map);
});

// Set up the WebSocket connection
const socket = new WebSocket('ws://localhost:8080');

// Set up the marker layer
const markerLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: []
  })
});
map.addLayer(markerLayer);

// Function to update the marker position
function updateMarkerPosition(deviceId, lon, lat) {
  const feature = markerLayer.getSource().getFeatureById(deviceId);
  if (feature) {
    feature.setGeometry(new ol.geom.Point(ol.proj.fromLonLat([lon, lat])));
  } else {
    const newFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
      id: deviceId
    });
    markerLayer.getSource().addFeature(newFeature);
  }
}

// Handle incoming WebSocket messages
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateMarkerPosition(data.deviceId, data.lon, data.lat);
};

// Handle WebSocket connection close
socket.onclose = () => {
  console.log('WebSocket connection closed');
};

// Handle WebSocket connection error
socket.onerror = (error) => {
  console.log('WebSocket connection error:', error);
};
