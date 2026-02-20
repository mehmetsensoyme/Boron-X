'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useRef, useMemo } from 'react';
import { CafeWithPrices } from '@/types';
import { useAppStore } from '@/store/useAppStore';

const getIcon = (isSelected: boolean = false) => {
  if (typeof window === 'undefined') return null;
  return L.icon({
    iconUrl: isSelected 
      ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
      : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

interface MapProps {
  center?: [number, number];
  zoom?: number;
  cafes?: CafeWithPrices[];
}

const MapHandler = ({ center }: { center: [number, number] }) => {
  const setMapCenter = useAppStore((state) => state.setMapCenter);
  const lastCenterRef = useRef<[number, number]>(center);
  const map = useMapEvents({
    moveend: () => {
      const newCenter = map.getCenter();
      // Sadece belirgin değişimlerde merkezi güncelle (performans için)
      if (Math.abs(newCenter.lat - lastCenterRef.current[0]) > 0.001 || 
          Math.abs(newCenter.lng - lastCenterRef.current[1]) > 0.001) {
        lastCenterRef.current = [newCenter.lat, newCenter.lng];
        setMapCenter([newCenter.lat, newCenter.lng]);
      }
    },
  });

  useEffect(() => {
    // Merkeze yumuşak geçiş yap
    if (center[0] !== lastCenterRef.current[0] || center[1] !== lastCenterRef.current[1]) {
      map.setView(center, map.getZoom(), { animate: true, duration: 0.8 });
      lastCenterRef.current = center;
    }
  }, [center, map]);

  return null;
};

const CoffeeMap = ({ center = [41.0082, 28.9784], zoom = 13, cafes = [] }: MapProps) => {
  const { setSelectedCafe, selectedCafe } = useAppStore();
  const [icons, setIcons] = useState<{ default: L.Icon, selected: L.Icon } | null>(null);

  useEffect(() => {
    const defaultIcon = getIcon(false);
    const selectedIcon = getIcon(true);
    if (defaultIcon && selectedIcon) {
      setIcons({ default: defaultIcon, selected: selectedIcon });
    }
  }, []);

  const markers = useMemo(() => {
    if (!icons) return null;
    return cafes.map((cafe) => (
      <Marker 
        key={`${cafe.id}-${cafe.latitude}-${cafe.longitude}`} // Daha stabil key
        position={[cafe.latitude, cafe.longitude]}
        icon={selectedCafe?.id === cafe.id ? icons.selected : icons.default}
        eventHandlers={{
          click: () => setSelectedCafe(cafe)
        }}
      >
        <Popup className="custom-popup" closeButton={false}>
          <div className="p-1 text-center min-w-[100px]">
            <p className="font-black text-[10px] uppercase tracking-tighter text-primary truncate">{cafe.name}</p>
            <div className="h-px bg-secondary/10 my-1" />
            <p className="text-[8px] font-bold text-muted-foreground uppercase">Görüntülemek için tıkla</p>
          </div>
        </Popup>
      </Marker>
    ));
  }, [cafes, icons, selectedCafe, setSelectedCafe]);

  if (!icons) return null;

  return (
    <div className="h-full w-full bg-card/30">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        className="h-full w-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapHandler center={center} />
        {markers}
      </MapContainer>
    </div>
  );
};

export default CoffeeMap;
