const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { Server } = require('socket.io');
const twilio = require('twilio');

// TWILIO CLIENT SETUP
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID, 
  process.env.TWILIO_AUTH_TOKEN
);

const app = express();
app.use(cors());
app.use(express.json()); // Allow JSON body parsing
app.use(express.static(path.resolve(__dirname, '../dist')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// STATE MANAGEMENT
let buses = {}; 
let subscribers = []; // Array of { phone, routeId, lastNotifiedStop }

// SUBSCRIPTION API
app.post('/subscribe', (req, res) => {
  const { phone, routeId } = req.body;
  if (!phone || !routeId) return res.status(400).send('Missing details');

  subscribers.push({ phone, routeId, lastNotifiedStop: null });
  console.log(`[SMS] New Subscriber for ${routeId}: ${phone}`);
  res.status(200).send('Subscribed Successfully');
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  socket.emit('allBuses', Object.values(buses));

  socket.on('tripStart', (data) => {
    if (!data.routeId) return;
    buses[data.routeId] = {
      ...data,
      lastUpdate: Date.now(),
      lat: data.stops ? data.stops[0].lat : 0,
      lng: data.stops ? data.stops[0].lng : 0,
      status: 'active'
    };
    io.emit('allBuses', Object.values(buses));
  });

  socket.on('locationUpdate', async (data) => {
    const { routeId, lat, lng, distanceRemaining, currentStop, nextStop } = data;
    if (!routeId || !buses[routeId]) return;

    const avgSpeed = 25; 
    let eta = distanceRemaining ? Math.round((distanceRemaining / avgSpeed) * 60) : 10;
    eta = Math.max(1, Math.min(60, eta));

    buses[routeId] = {
      ...buses[routeId],
      lat, lng, currentStop, nextStop,
      etaMinutes: eta,
      lastUpdate: Date.now()
    };

    io.emit('allBuses', Object.values(buses));

    // CHECK FOR SMS TRIGGER
    // If the bus is near the next stop (e.g. within 2 mins), notify subscribers
    if (eta <= 3 && nextStop) {
      subscribers.forEach(async (sub) => {
        if (sub.routeId === routeId && sub.lastNotifiedStop !== nextStop) {
          try {
            await twilioClient.messages.create({
              body: `TransitPulse: Your bus (${routeId}) is arriving at ${nextStop} in ~${eta} mins. Get ready!`,
              from: process.env.TWILIO_FROM,
              to: sub.phone
            });
            sub.lastNotifiedStop = nextStop; // Prevent spamming for the same stop
            console.log(`[SMS] Sent to ${sub.phone} for stop ${nextStop}`);
          } catch (err) {
            console.error(`[SMS] Error sending to ${sub.phone}:`, err.message);
          }
        }
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Smart Server w/ SMS running on port ${PORT}`));
