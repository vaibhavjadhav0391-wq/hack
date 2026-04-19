const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

let busLocations = {}; // { busId: {lat, lng, speed, timestamp} }

io.on('connection', (socket) => {
  // Driver sends location
  socket.on('locationUpdate', (data) => {
    if (!data) return;
    console.log("Received from driver:", data);
    // data: { busId, lat, lng, speed, accuracy }
    busLocations[data.busId] = { ...data, timestamp: Date.now() };
    io.emit('liveLocation', { ...data, timestamp: Date.now() });
  });

  // On connect, send all current bus locations
  socket.emit('init-locations', busLocations);

  socket.on('disconnect', () => {});
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
