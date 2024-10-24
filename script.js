// Crie um mapa com Leaflet
var map = L.map('map').setView([-23.5505, -46.6333], 13); // Posição inicial (São Paulo)

// Adicione uma camada de mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    subdomains: ['a', 'b', 'c']
}).addTo(map);

// Conecte-se ao servidor Socket.IO
var socket = io('http://localhost:3000');

// Função para atualizar a localização de um dispositivo no mapa
function updateDeviceLocation(deviceId, position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var marker = markers[deviceId];
    if (!marker) {
        marker = L.marker([lat, lon]).addTo(map);
        markers[deviceId] = marker;
    } else {
        marker.setLatLng([lat, lon]);
    }
}

// Objeto para armazenar os marcadores dos dispositivos
var markers = {};

// Escute as atualizações de localização dos dispositivos
socket.on('deviceLocationUpdate', function(data) {
    updateDeviceLocation(data.deviceId, data.position);
});

// Enviar a localização do dispositivo atual para o servidor
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function(position) {
        socket.emit('updateDeviceLocation', {
            deviceId: 'device1', // Substitua por um ID de dispositivo único
            position: position
        });
    }, function(error) {
        console.error("Erro ao obter localização: ", error);
    }, {
        enableHighAccuracy: true, // Habilita alta precisão
        maximumAge: 0, // Não usa localização em cache
        timeout: 5000 // Tempo limite para obter a localização
    });
} else {
    alert("Geolocalização não é suportada neste navegador.");
}
