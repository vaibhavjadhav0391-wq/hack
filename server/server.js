const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.static(path.resolve(__dirname, '../dist')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// MULTI-BUS STATE STORAGE
let buses = {}; 

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Send initial data to new listeners
  socket.emit('allBuses', Object.values(buses));

  // Initialize a Bus Journey
  socket.on('tripStart', (data) => {
    if (!data.routeId) return;
    buses[data.routeId] = {
      ...data,
      lastUpdate: Date.now(),
      lat: data.stops[0].lat,
      lng: data.stops[0].lng,
      status: 'active'
    };
    console.log(`[${data.routeId}] Journey Started: ${data.source} -> ${data.destination}`);
    io.emit('allBuses', Object.values(buses));
  });

  // Handle Location Updates + Smart ETA
  socket.on('locationUpdate', (data) => {
    const { routeId, lat, lng, distanceRemaining } = data;
    if (!routeId || !buses[routeId]) return;

    // Realistic ETA: (Distance in km / 30 km/h) * 60 minutes
    // If distance is missing, we use a fallback of 5-15 mins
    const avgSpeed = 25; 
    let eta = distanceRemaining ? Math.round((distanceRemaining / avgSpeed) * 60) : 10;
    eta = Math.max(1, Math.min(60, eta)); // Bound between 1-60 mins

    buses[routeId] = {
      ...buses[routeId],
      lat,
      lng,
      currentStop: data.currentStop || buses[routeId].currentStop,
      nextStop: data.nextStop || buses[routeId].nextStop,
      etaMinutes: eta,
      lastUpdate: Date.now()
    };

    io.emit('allBuses', Object.values(buses));
    console.log(`[${routeId}] Update: ETA ${eta}m | Lat: ${lat} Lng: ${lng}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Smart Server running on port ${PORT}`));
