const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
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
app.post('/subscribe', async (req, res) => {
  const { phone, routeId } = req.body;
  if (!phone || !routeId) return res.status(400).send('Missing details');

  subscribers.push({ phone, routeId, lastNotifiedStop: null });
  console.log(`[SMS] New Subscriber for ${routeId}: ${phone}`);

  // 1. SEND IMMEDIATE WELCOME SMS
  try {
    await twilioClient.messages.create({
      body: `TransitPulse: Thank you for subscribing! We will now text you live updates for bus ${routeId}.`,
      from: process.env.TWILIO_FROM,
      to: phone
    });
    res.status(200).send('Subscribed Successfully');
  } catch (err) {
    console.error(`[SMS] Welcome Error:`, err.message);
    res.status(200).send('Subscribed (SMS delayed)'); // Still succeed but log error
  }
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

    const bus = buses[routeId];
    buses[routeId] = {
      ...bus,
      lat, lng, currentStop, nextStop,
      etaMinutes: eta,
      lastUpdate: Date.now()
    };

    io.emit('allBuses', Object.values(buses));

    // 2. LIVE STOP & ARRIVAL UPDATES
    if (nextStop) {
      subscribers.forEach(async (sub) => {
        if (sub.routeId === routeId && sub.lastNotifiedStop !== nextStop) {
          
          let alertMessage = `TransitPulse: Your bus is approaching. Next stop: ${nextStop}. ETA: ${eta} mins.`;
          
          // Check if this is the final stop
          if (nextStop === bus.destination) {
            alertMessage = `TransitPulse: Your bus is arriving at its final destination: ${nextStop}. Please gather your belongings!`;
          }

          try {
            await twilioClient.messages.create({
              body: alertMessage,
              from: process.env.TWILIO_FROM,
              to: sub.phone
            });
            sub.lastNotifiedStop = nextStop;
            console.log(`[SMS] Update sent to ${sub.phone} for ${nextStop}`);
          } catch (err) {
            console.error(`[SMS] Update Error:`, err.message);
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
