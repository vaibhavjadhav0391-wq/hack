import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation, Wifi, WifiOff, Upload, CheckCircle, Bus, MapPin, Clock, Battery, Signal, Play, Square, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Backend URL
const busId = 'BUS-01';

export default function DriverPage() {
  const [tripActive, setTripActive] = useState(false)
  const [bufferedPings, setBufferedPings] = useState(0)
  const [totalPings, setTotalPings] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [speed, setSpeed] = useState(0)
  const [position, setPosition] = useState({ lat: 28.6139, lng: 77.2090 })
  const [elapsed, setElapsed] = useState(0)
  const [source, setSource] = useState('Sambhaji Nagar')
  const [destination, setDestination] = useState('')
  const [tripData, setTripData] = useState<any>(null)

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "YOUR_MAPBOX_TOKEN_HERE";

  const watchIdRef = useRef<number | null>(null);

  const startTracking = () => {
    if ('geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setSpeed(pos.coords.speed || 0);

          if (isOnline) {
            const data = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              speed: pos.coords.speed || 0,
              accuracy: pos.coords.accuracy || 0,
              ...tripData
            };
            console.log("Sending:", data);
            socket.emit("locationUpdate", data);
          } else {
            setBufferedPings(p => p + 1);
          }
        },
        (err) => console.error('Geolocation error:', err),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const toggleNetwork = () => {
    if (isOnline) {
      setIsOnline(false)
    } else {
      setSyncing(true)
      setTimeout(() => {
        setIsOnline(true)
        setBufferedPings(0)
        setSyncing(false)
      }, 2000)
    }
  }

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="min-h-screen pt-16 pb-16 bg-navy-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/30">
              <Bus size={28} className="text-black" />
            </div>
            <h1 className="font-display font-bold text-2xl text-white mb-1">Driver Dashboard</h1>
            <p className="text-slate-400 text-sm">BUS-01 · Campus Loop · Driver: Ramesh K.</p>
          </div>
        </motion.div>

        {/* Network status banner */}
        <AnimatePresence>
          {!isOnline && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
            >
              <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-400 text-sm font-medium">Offline — {bufferedPings} pings buffered</p>
                <p className="text-red-400/60 text-xs">GPS data saved locally. Will sync on reconnect.</p>
              </div>
              <WifiOff size={14} className="text-red-400" />
            </motion.div>
          )}
          {syncing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3"
            >
              <Upload size={16} className="text-amber-400 animate-bounce" />
              <p className="text-amber-400 text-sm">Uploading {bufferedPings} buffered pings...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Source / Destination Inputs */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="glass-light border border-white/8 rounded-2xl p-6 mb-4"
        >
          <div className="grid gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Source</label>
              <input 
                type="text" 
                value={source} 
                onChange={(e) => setSource(e.target.value)} 
                disabled={tripActive}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-teal-500/50" 
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Destination</label>
              <input 
                type="text" 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)}
                disabled={tripActive}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-teal-500/50" 
                placeholder="Enter destination..."
              />
            </div>
          </div>
        </motion.div>

        {/* Main trip control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-light border border-white/8 rounded-2xl p-6 mb-4"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-slate-400 mb-1">Trip Status</p>
              <div className="flex items-center gap-2">
                <span className={cn('w-2 h-2 rounded-full', tripActive ? 'bg-teal-400 animate-pulse' : 'bg-slate-600')} />
                <p className="text-white font-semibold">{tripActive ? 'In Progress' : 'Idle'}</p>
              </div>
            </div>
            {tripActive && (
              <div className="text-right">
                <p className="text-xs text-slate-400 mb-1">Elapsed</p>
                <p className="font-mono text-teal-400 font-semibold">{formatTime(elapsed)}</p>
              </div>
            )}
          </div>

          <button
            onClick={async () => {
              if (!tripActive) {
                let currentTripData = { source, destination, srcCoords: null, destCoords: null, routeGeoJSON: null };
                if (source && destination) {
                   try {
                     const [srcRes, destRes] = await Promise.all([
                       fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(source)}.json?access_token=${MAPBOX_TOKEN}&country=IN`).then(r => r.json()),
                       fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destination)}.json?access_token=${MAPBOX_TOKEN}&country=IN`).then(r => r.json())
                     ]);
                     const srcCoords = srcRes.features?.[0]?.center;
                     const destCoords = destRes.features?.[0]?.center;
                     
                     if (srcCoords && destCoords) {
                       currentTripData.srcCoords = srcCoords;
                       currentTripData.destCoords = destCoords;
                       const routeRes = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${srcCoords[0]},${srcCoords[1]};${destCoords[0]},${destCoords[1]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`).then(r => r.json());
                       currentTripData.routeGeoJSON = routeRes.routes?.[0]?.geometry;
                     }
                   } catch(e) {
                     console.error("Geocoding/Directions error", e);
                   }
                }
                setTripData(currentTripData);
                setTripActive(true);
                setElapsed(0);
                setTotalPings(0);
                setBufferedPings(0);
                startTracking(); // <--- start tracking directly!
              } else {
                setTripActive(false);
                stopTracking(); // <--- explicitly clear watch
              }
            }}
            className={cn(
              'w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-3 transition-all duration-200',
              tripActive
                ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20'
                : 'bg-teal-500 text-black hover:bg-teal-400 shadow-lg shadow-teal-500/20'
            )}
          >
            {tripActive ? <><Square size={16} /> End Trip</> : <><Play size={16} /> Start Trip</>}
          </button>
        </motion.div>

        {/* Stats grid */}
        {tripActive && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: 'Speed', value: `${Math.round(speed)} km/h`, icon: Navigation, color: 'teal' },
              { label: 'Total Pings', value: totalPings.toString(), icon: Signal, color: 'cyan' },
              { label: 'Buffered', value: bufferedPings.toString(), icon: Database, color: bufferedPings > 0 ? 'amber' : 'green' },
              { label: 'Connection', value: isOnline ? 'Online' : 'Offline', icon: isOnline ? Wifi : WifiOff, color: isOnline ? 'green' : 'red' },
            ].map(stat => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="glass-light border border-white/5 rounded-xl p-4 flex items-center gap-3">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', stat.color === 'teal' && 'bg-teal-500/10', stat.color === 'cyan' && 'bg-cyan-500/10', stat.color === 'green' && 'bg-green-500/10', stat.color === 'amber' && 'bg-amber-500/10', stat.color === 'red' && 'bg-red-500/10')}>
                    <Icon size={14} className={cn(stat.color === 'teal' && 'text-teal-400', stat.color === 'cyan' && 'text-cyan-400', stat.color === 'green' && 'text-green-400', stat.color === 'amber' && 'text-amber-400', stat.color === 'red' && 'text-red-400')} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{stat.value}</p>
                    <p className="text-slate-500 text-xs">{stat.label}</p>
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}

        {/* GPS position */}
        {tripActive && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-light border border-white/5 rounded-2xl p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={14} className="text-teal-400" />
              <p className="text-xs font-semibold text-slate-400">Current GPS Position</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Latitude</p>
                <p className="font-mono text-teal-400 text-sm">{position.lat.toFixed(6)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Longitude</p>
                <p className="font-mono text-teal-400 text-sm">{position.lng.toFixed(6)}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Network simulator */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-light border border-white/5 rounded-2xl p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Network Simulator</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isOnline ? <Wifi size={18} className="text-teal-400" /> : <WifiOff size={18} className="text-red-400" />}
              <div>
                <p className={cn('text-sm font-semibold', isOnline ? 'text-teal-400' : 'text-red-400')}>{isOnline ? 'Connected' : 'Disconnected'}</p>
                <p className="text-xs text-slate-500">{isOnline ? 'WebSocket active' : `${bufferedPings} pings in IndexedDB`}</p>
              </div>
            </div>
            <button
              onClick={toggleNetwork}
              disabled={syncing}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-semibold transition-all',
                isOnline ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20' : 'bg-teal-500/10 border border-teal-500/20 text-teal-400 hover:bg-teal-500/20',
                syncing && 'opacity-50 cursor-not-allowed'
              )}
            >
              {syncing ? 'Syncing...' : isOnline ? 'Simulate Offline' : 'Reconnect'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Simple inline icon
function Database({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  )
}
