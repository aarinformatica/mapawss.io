// Set up the map
const map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([80.2459, 12.9860]),
    zoom: 15
  })
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
