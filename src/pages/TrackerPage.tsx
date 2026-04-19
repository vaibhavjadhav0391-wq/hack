import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Wifi, Bus, Navigation, Activity, ChevronRight, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import Map, { Marker, Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import io from 'socket.io-client'

const socket = io(import.meta.env.VITE_BACKEND_URL);
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface BusStop {
  name: string;
  lat: number;
  lng: number;
}

interface BusData {
  routeId: string;
  lat: number;
  lng: number;
  source: string;
  destination: string;
  currentStop?: string;
  nextStop?: string;
  etaMinutes?: number;
  status: string;
  stops: BusStop[];
  lastUpdate: number;
  displayLat: number; // For smooth interpolation
  displayLng: number; // For smooth interpolation
}

export default function TrackerPage() {
  const [buses, setBuses] = useState<Record<string, BusData>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewState, setViewState] = useState({
    longitude: 75.3238,
    latitude: 19.8762,
    zoom: 13,
    pitch: 45,
    bearing: 0
  });

  const mapRef = useRef<any>(null);

  // 1. SMART SOCKET LISTENER
  useEffect(() => {
    socket.on('allBuses', (allBuses: BusData[]) => {
      setBuses(prev => {
        const next = { ...prev };
        allBuses.forEach(b => {
          if (!next[b.routeId]) {
            next[b.routeId] = { ...b, displayLat: b.lat, displayLng: b.lng };
          } else {
            // Update everything EXCEPT display coordinates (handled by interpolator)
            next[b.routeId] = { 
              ...next[b.routeId], 
              ...b, 
              displayLat: next[b.routeId].displayLat, 
              displayLng: next[b.routeId].displayLng 
            };
          }
        });
        return next;
      });
    });

    return () => { socket.off('allBuses'); };
  }, []);

  // 2. 60FPS SMOOTH INTERPOLATION ENGINE
  useEffect(() => {
    const frame = requestAnimationFrame(function animate() {
      setBuses(prev => {
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach(id => {
          const b = next[id];
          const latDiff = b.lat - b.displayLat;
          const lngDiff = b.lng - b.displayLng;
          
          // Smoothly glide towards target (0.1 = 10% per frame)
          if (Math.abs(latDiff) > 0.00001 || Math.abs(lngDiff) > 0.00001) {
            b.displayLat += latDiff * 0.08;
            b.displayLng += lngDiff * 0.08;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
      requestAnimationFrame(animate);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const selectedBus = selectedId ? buses[selectedId] : null;

  // Auto-follow logic
  useEffect(() => {
    if (selectedBus && mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedBus.displayLng, selectedBus.displayLat],
        zoom: 15.5,
        duration: 2000,
        essential: true
      });
    }
  }, [selectedId]);

  return (
    <div className="min-h-screen pt-16 flex flex-col bg-slate-950 font-sans">
      <div className="flex-1 grid lg:grid-cols-[340px,1fr] gap-0">
        
        {/* SIDEBAR PANEL */}
        <aside className="bg-slate-900 border-r border-white/5 flex flex-col h-[calc(100vh-64px)] overflow-hidden z-20 shadow-2xl">
          <div className="p-5 border-b border-white/10 bg-gradient-to-br from-indigo-500/10 to-transparent">
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Activity className="text-indigo-400" size={20} />
              Fleet Monitor
            </h1>
            <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                {Object.keys(buses).length} Active Buses
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence mode="popLayout">
              {Object.values(buses).map(bus => (
                <motion.div
                  key={bus.routeId}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedId(bus.routeId)}
                  className={cn(
                    "relative overflow-hidden group p-4 rounded-2xl cursor-pointer transition-all duration-300 border",
                    selectedId === bus.routeId 
                      ? "bg-indigo-500/20 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]" 
                      : "bg-white/5 border-white/5 hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-xl", selectedId === bus.routeId ? "bg-indigo-500 text-white" : "bg-white/10 text-slate-400")}>
                        <Bus size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{bus.routeId}</h3>
                        <p className="text-[10px] text-slate-500 uppercase font-black">{bus.source} &rarr; {bus.destination}</p>
                      </div>
                    </div>
                    {selectedId === bus.routeId && (
                      <div className="p-1 px-2 rounded-md bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase">Selected</div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="bg-black/20 rounded-lg p-2.5">
                      <p className="text-[8px] uppercase text-slate-500 font-bold mb-1">Next Stop</p>
                      <p className="text-xs text-white font-bold truncate">{bus.nextStop || '--'}</p>
                    </div>
                    <div className="bg-black/20 rounded-lg p-2.5">
                      <p className="text-[8px] uppercase text-slate-500 font-bold mb-1">Live ETA</p>
                      <p className="text-xs text-indigo-400 font-bold">{bus.etaMinutes || '--'} min</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {Object.keys(buses).length === 0 && (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                  <AlertCircle className="text-slate-600" size={24} />
                </div>
                <p className="text-slate-500 text-sm font-medium">Waiting for GPS feeds...</p>
                <p className="text-slate-600 text-xs mt-1">Start Bus Driver App to begin tracking</p>
              </div>
            )}
          </div>

          {selectedBus && (
            <div className="p-5 bg-slate-950 border-t border-white/10 space-y-6">
              {/* SMS SUBSCRIPTION SECTION */}
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="p-1 rounded bg-indigo-500 text-[10px] text-white font-bold">SMS</span>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Arrival Alerts</h4>
                </div>
                <p className="text-[10px] text-slate-400 mb-4 font-medium leading-relaxed">
                  We will text you when {selectedBus.routeId} is within 3 minutes of your stop.
                </p>
                <div className="flex gap-2">
                  <input 
                    type="tel" 
                    id="phone-input"
                    placeholder="+91..." 
                    className="flex-1 min-w-0 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button 
                    onClick={async () => {
                      const phone = (document.getElementById('phone-input') as HTMLInputElement).value;
                      if(!phone) return alert('Enter phone number');
                      
                      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/subscribe`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone, routeId: selectedBus.routeId })
                      });
                      
                      if(res.ok) {
                        alert('Alert Set! We will text you.');
                        (document.getElementById('phone-input') as HTMLInputElement).value = '';
                      }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-3 py-2 rounded-lg transition-all active:scale-95"
                  >
                    Notify
                  </button>
                </div>
              </div>

              {/* ROUTE DETAILS */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Route Progression</span>
                  <Navigation className="text-indigo-400" size={14} />
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      <div className="w-0.5 flex-1 bg-slate-800 my-1" />
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Active Step</p>
                        <p className="text-xs text-white font-bold">{selectedBus.currentStop || selectedBus.source}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Final Destination</p>
                        <p className="text-xs text-white font-bold">{selectedBus.destination}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* MAP PANEL */}
        <main className="relative">
          <Map
            ref={mapRef}
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
          >
            {/* 1. BUS MARKERS */}
            {Object.values(buses).map(bus => (
              <Marker
                key={bus.routeId}
                longitude={bus.displayLng}
                latitude={bus.displayLat}
                anchor="center"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelectedId(bus.routeId);
                }}
              >
                <div className={cn(
                  "p-1.5 rounded-full border-2 border-white cursor-pointer transition-all duration-500 shadow-2xl",
                  selectedId === bus.routeId 
                    ? "bg-indigo-500 scale-125 z-50 ring-4 ring-indigo-500/20" 
                    : "bg-slate-700 hover:bg-slate-600 z-10"
                )}>
                  <Bus size={16} className="text-white" />
                </div>
              </Marker>
            ))}

            {/* 2. STOP MARKERS (For Selected Bus) */}
            {selectedBus?.stops?.map((stop, idx) => (
              <Marker
                key={`${selectedBus.routeId}-stop-${idx}`}
                longitude={stop.lng}
                latitude={stop.lat}
                anchor="bottom"
              >
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="bg-slate-900 border border-white/20 px-2 py-1 rounded text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity mb-1 whitespace-nowrap font-bold">
                    {stop.name}
                  </div>
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full border-2 border-white",
                    stop.name === selectedBus.currentStop ? "bg-emerald-500 scale-125" : "bg-indigo-400"
                  )} />
                </div>
              </Marker>
            ))}

            {/* 3. TRIP START OVERLAY */}
            {!selectedId && Object.keys(buses).length > 0 && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-sm font-bold text-white tracking-tight">Select a bus from the fleet to track live movement</span>
              </div>
            )}
          </Map>
        </main>
      </div>
    </div>
  )
}
