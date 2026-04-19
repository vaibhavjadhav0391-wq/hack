
import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

interface Mapbox3DProps {
  accessToken: string;
  styleUrl: string;
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch?: number;
    bearing?: number;
  };
}

const Mapbox3D: React.FC<Mapbox3DProps> = ({
  accessToken,
  styleUrl,
  initialViewState = {
    longitude: 7.6215,
    latitude: 51.96097,
    zoom: 12.29,
    pitch: 60,
    bearing: -60,
  },
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mapboxgl.accessToken = accessToken;
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: [initialViewState.longitude, initialViewState.latitude],
      zoom: initialViewState.zoom,
      pitch: initialViewState.pitch,
      bearing: initialViewState.bearing,
      antialias: true,
    });

    map.addControl(new mapboxgl.NavigationControl());

    return () => map.remove();
  }, [accessToken, styleUrl, initialViewState]);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "100%", borderRadius: "16px", overflow: "hidden" }}
    />
  );
};

export default Mapbox3D;
