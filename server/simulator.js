const io = require('socket.io-client');
const socket = io('http://localhost:5000');

const dummyBuses = [
  {
    routeId: 'BUS-01 (Express)',
    source: 'Railway Station',
    destination: 'Cyber Hub',
    stops: [
      { name: 'Station', lat: 19.8900, lng: 75.3200 },
      { name: 'Mall', lat: 19.8850, lng: 75.3300 },
      { name: 'Office', lat: 19.8800, lng: 75.3400 },
      { name: 'Cyber Hub', lat: 19.8700, lng: 75.3500 }
    ]
  },
  {
    routeId: 'BUS-02 (Local)',
    source: 'Airport',
    destination: 'City Center',
    stops: [
      { name: 'Airport', lat: 19.8600, lng: 75.3800 },
      { name: 'Hospital', lat: 19.8650, lng: 75.3600 },
      { name: 'High School', lat: 19.8700, lng: 75.3400 },
      { name: 'City Center', lat: 19.8750, lng: 75.3200 }
    ]
  }
];

socket.on('connect', () => {
  console.log('Connected to server. Starting simulation...');

  dummyBuses.forEach(bus => {
    socket.emit('tripStart', bus);
  });

  // Simulation loop
  let step = 0;
  setInterval(() => {
    dummyBuses.forEach((bus, i) => {
      // Simulate movement between stops
      const start = bus.stops[0];
      const end = bus.stops[bus.stops.length - 1];
      
      const progress = (step % 100) / 100;
      const lat = start.lat + (end.lat - start.lat) * progress;
      const lng = start.lng + (end.lng - start.lng) * progress;
      
      const stopIdx = Math.floor(progress * bus.stops.length);
      const currentStop = bus.stops[stopIdx]?.name;
      const nextStop = bus.stops[stopIdx + 1]?.name || bus.destination;

      socket.emit('locationUpdate', {
        routeId: bus.routeId,
        lat,
        lng,
        currentStop,
        nextStop,
        distanceRemaining: (1 - progress) * 5 // 5km total route
      });
    });
    step++;
  }, 2000);
});
