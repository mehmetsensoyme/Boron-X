'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { CafeWithPrices } from '@/types';
import { useAppStore } from '@/store/useAppStore';

// Browser-safe icon initialization
const getIcon = () => {
  if (typeof window === 'undefined') return null;
  return L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
};

interface MapProps {
  center?: [number, number];
  zoom?: number;
  cafes?: CafeWithPrices[];
}

const MapController = ({ center }: { center: [number, number] }) => {
  const map = useMapEvents({});
  useEffect(() => {
    if (center) {
      map.flyTo(center, map.getZoom(), { duration: 1.5 });
    }
  }, [center, map]);
  return null;
};

const CoffeeMap = ({ center = [41.0082, 28.9784], zoom = 13, cafes = [] }: MapProps) => {
  const setSelectedCafe = useAppStore((state) => state.setSelectedCafe);
  const [icon, setIcon] = useState<L.Icon | null>(null);

  useEffect(() => {
    setIcon(getIcon());
  }, []);

  if (!icon) return null;

  return (
    <div className="h-full w-full overflow-hidden rounded-[40px] border border-secondary/10 shadow-2xl bg-muted/30 min-h-[500px]">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        className="h-[600px] w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={center} />
        
        {cafes.map((cafe) => (
          <Marker 
            key={cafe.id} 
            position={[cafe.latitude, cafe.longitude]}
            icon={icon}
            eventHandlers={{
              click: () => setSelectedCafe(cafe)
            }}
          >
            <Popup className="custom-popup">
              <div className="p-2 text-center">
                <p className="font-black text-xs uppercase tracking-tighter text-primary">{cafe.name}</p>
                <p className="text-[9px] text-muted-foreground mt-1">Detaylar için tıkla</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CoffeeMap;
