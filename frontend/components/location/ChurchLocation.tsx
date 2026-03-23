'use client';

import { useEffect, useRef } from 'react';

interface Parish {
  name: string;
  lat: number;
  lng: number;
  address: string;
  active?: boolean;
}

interface ParishMapProps {
  parishes: Parish[];
  activeIndex: number;
}

export default function ParishMap({ parishes, activeIndex }: ParishMapProps) {
  const mapRef     = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const divRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!divRef.current) return;

    // FIX "Map container is already initialized" (hot-reload Next.js)
    if ((divRef.current as any)._leaflet_id) {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
      }
    }

    import('leaflet').then((L) => {
      if (!divRef.current) return;
      if ((divRef.current as any)._leaflet_id) return;

      // Fix icônes par défaut Leaflet (problème connu avec webpack/Next.js)
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Créer la carte centrée sur la première paroisse
      const map = L.map(divRef.current, {
        center:      [parishes[0].lat, parishes[0].lng],
        zoom:        15,
        zoomControl: false,
      });

      // Tuiles OpenStreetMap — gratuit, pas de clé API
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Contrôles zoom
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Icône active (bleue avec animation ping)
      const activeIcon = L.divIcon({
        className: '',
        html: `
          <div style="position:relative;display:flex;flex-direction:column;align-items:center">
            <div style="background:#135bec;color:white;width:44px;height:44px;border-radius:50%;border:4px solid white;box-shadow:0 8px 24px rgba(19,91,236,0.5);display:flex;align-items:center;justify-content:center;font-size:20px;z-index:2;position:relative">
              ⛪
            </div>
            <div style="width:70px;height:70px;background:rgba(19,91,236,0.2);border-radius:50%;position:absolute;top:50%;left:50%;transform:translate(-50%,-30%);animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;z-index:1"></div>
          </div>
        `,
        iconSize:    [44, 60],
        iconAnchor:  [22, 44],
        popupAnchor: [0, -48],
      });

      // Icône inactive (grise)
      const defaultIcon = L.divIcon({
        className: '',
        html: `
          <div style="background:#64748b;color:white;width:36px;height:36px;border-radius:50%;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;font-size:16px">
            ⛪
          </div>
        `,
        iconSize:    [36, 36],
        iconAnchor:  [18, 36],
        popupAnchor: [0, -40],
      });

      // Ajouter les marqueurs
      parishes.forEach((parish, i) => {
        const marker = L.marker([parish.lat, parish.lng], {
          icon: i === activeIndex ? activeIcon : defaultIcon,
        })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:system-ui;min-width:180px;padding:4px">
              <p style="font-weight:800;font-size:14px;color:#0f172a;margin:0 0 4px">${parish.name}</p>
              <p style="font-size:12px;color:#64748b;margin:0">${parish.address}</p>
            </div>`,
            { maxWidth: 240 }
          );

        if (i === activeIndex) marker.openPopup();
        markersRef.current.push(marker);
      });

      mapRef.current = map;
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
      }
    };
  }, []);

  // Centrer la carte quand activeIndex change
  useEffect(() => {
    if (!mapRef.current || !parishes[activeIndex]) return;
    const { lat, lng } = parishes[activeIndex];
    mapRef.current.flyTo([lat, lng], 15, { duration: 1.2 });
    markersRef.current[activeIndex]?.openPopup();
  }, [activeIndex]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <style>{`
        @keyframes ping {
          75%, 100% { transform: translate(-50%, -30%) scale(2); opacity: 0; }
        }
      `}</style>
      <div ref={divRef} style={{ width: '100%', height: '100%', minHeight: '400px' }} />
    </>
  );
}