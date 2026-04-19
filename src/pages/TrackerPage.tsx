import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Wifi, WifiOff, Zap, Bus, ChevronRight, Activity, Navigation, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Map, { Marker, Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import io from 'socket.io-client'
import mapboxgl from 'mapbox-gl'
const socket = io('http://localhost:5000'); // Backend URL

type BusLocation = {
  busId?: string;
  lat: number;
  lng: number;
  speed: number;
  accuracy: number;
  timestamp?: number;
  source?: string;
  destination?: string;
  srcCoords?: [number, number];
  destCoords?: [number, number];
  routeGeoJSON?: any;
};

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "YOUR_MAPBOX_TOKEN_HERE";

// Helper for distance calc
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function TrackerPage() {
  const [bus, setBus] = useState<BusLocation | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [now, setNow] = useState<number>(Date.now());
  const [viewState, setViewState] = useState({
    longitude: 77.2090,
    latitude: 28.6139,
    zoom: 14,
    pitch: 45,
    bearing: 0
  });
  const mapRef = useRef<any>(null);
  const markerRef = useRef<mapboxgl.Marker>(null);

  useEffect(() => {
    socket.on('liveLocation', (data: BusLocation) => {
      if (!data) {
        console.error("No data received on tracker");
        return;
      }
      console.log("Received on tracker:", data);
      
      setBus(data);
      setLastUpdate(Date.now());
      
      if (markerRef.current) {
        markerRef.current.setLngLat([data.lng, data.lat]);
      }
      if (mapRef.current) {
        const map = typeof mapRef.current.getMap === 'function' ? mapRef.current.getMap() : mapRef.current;
        if (map && typeof map.flyTo === 'function') {
           map.flyTo({
             center: [data.lng, data.lat],
             zoom: 15
           });
        }
      }
    });
    return () => {
      socket.off('liveLocation');
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeSinceLastUpdate = (now - lastUpdate) / 1000;
  const isDelayed = bus && timeSinceLastUpdate > 10;
  
  let distanceRemaining = '--';
  if (bus?.destCoords && bus?.lat) {
    const dist = getDistance(bus.lat, bus.lng, bus.destCoords[1], bus.destCoords[0]);
    distanceRemaining = dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`;
  }

  return (
    <div className="min-h-screen pt-16 flex flex-col bg-navy-900">
      <div className="flex-1 grid lg:grid-cols-[320px,1fr] gap-0">
        {/* Sidebar */}
        <div className="glass border-r border-white/5 flex flex-col h-[calc(100vh-64px)] overflow-y-auto z-10 relative bg-navy-900">
          <div className="p-4 border-b border-white/5">
            <h1 className="font-display font-bold text-white text-lg">Live Tracker</h1>
            <p className="text-slate-500 text-xs mt-0.5">{bus?.source ? `${bus.source} → ${bus.destination}` : 'Waiting for trip...'}</p>
          </div>

          {/* Network status */}
          <div className="p-4 border-b border-white/5">
            <div className={cn('flex items-center gap-2.5 px-3 py-2.5 rounded-xl glass-light border', isDelayed ? 'border-amber-500/20' : 'border-teal-500/20')}>
              <span className={cn('w-2 h-2 rounded-full flex-shrink-0', isDelayed ? 'bg-amber-400' : 'bg-teal-400', 'animate-pulse')} />
              <div className="flex-1 min-w-0">
                <p className={cn('text-xs font-semibold', isDelayed ? 'text-amber-400' : 'text-teal-400')}>
                   {isDelayed ? 'DELAYED — Last Known Pos' : 'Live — WebSocket'}
                </p>
                <p className="text-xs text-slate-500">Updates every 3s</p>
              </div>
              <Wifi size={14} className={isDelayed ? "text-amber-400" : "text-teal-400"} />
            </div>
          </div>

          {/* Primary bus card */}
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center">
                <Bus size={14} className="text-black" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">BUS-01</p>
                <p className="text-slate-500 text-xs">Campus Loop</p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isDelayed ? "bg-amber-400" : "bg-teal-400")} />
                <span className={cn("text-xs font-semibold tracking-wider", isDelayed ? "text-amber-400" : "text-teal-400")}>{isDelayed ? "DELAYED" : "LIVE"}</span>
              </div>
            </div>

            <div className="stat-card rounded-xl p-4 mb-3 border border-white/5 bg-white/5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Distance Remaining</p>
                  <p className="text-white font-semibold text-sm">{bus ? distanceRemaining : 'Waiting for data...'}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-teal-400">{bus ? Math.round(bus.speed) : '--'}</p>
                  <p className="text-xs text-slate-400">km/h</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="glass-light rounded-lg p-2 text-center border border-white/5 bg-black/20">
                <p className="text-white text-xs font-semibold">{bus ? Math.round(bus.speed) : '--'} km/h</p>
                <p className="text-slate-500 text-[10px] mt-0.5">Speed</p>
              </div>
              <div className="glass-light rounded-lg p-2 text-center border border-white/5 bg-black/20">
                <p className="text-white text-xs font-semibold">{bus ? Math.round(bus.accuracy) : '--'} m</p>
                <p className="text-slate-500 text-[10px] mt-0.5">Accuracy</p>
              </div>
              <div className="glass-light rounded-lg p-2 text-center border border-white/5 bg-black/20">
                <p className={cn("text-xs font-semibold", isDelayed ? "text-amber-400" : "text-teal-400")}>{bus ? (isDelayed ? 'DELAYED' : 'LIVE') : '--'}</p>
                <p className="text-slate-500 text-[10px] mt-0.5">Status</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map area */}
        <div className="relative w-full h-[calc(100vh-64px)] z-0">
          <Map
            ref={mapRef}
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/yaak-driving-curriculum/cm6up5as0019a01r5e6n33wmn"
            mapboxAccessToken={MAPBOX_TOKEN}
          >
            {bus?.routeGeoJSON && (
              <Source id="route" type="geojson" data={bus.routeGeoJSON}>
                <Layer
                  id="route-layer"
                  type="line"
                  paint={{
                    'line-color': '#14b8a6',
                    'line-width': 5,
                    'line-opacity': 0.8
                  }}
                />
              </Source>
            )}

            {bus && (
              <Marker ref={markerRef} longitude={bus.lng} latitude={bus.lat} anchor="center">
                <div style={{ transition: 'all 0.5s ease-in-out' }} className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.6)] border-2 border-white">
                  <Bus size={16} className="text-black" />
                </div>
              </Marker>
            )}
            
            {bus?.destCoords && (
               <Marker longitude={bus.destCoords[0]} latitude={bus.destCoords[1]} anchor="bottom">
                  <MapPin size={32} className="text-red-500 drop-shadow-md" />
               </Marker>
            )}
            
            {!bus && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium border border-white/10 shadow-xl z-20 backdrop-blur-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" /> Waiting for live data...
              </div>
            )}
          </Map>
        </div>
      </div>
    </div>
  )
}
