'use client';

import { useEffect, useRef, useState } from 'react';
import type { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export function MapboxMap({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [status, setStatus] = useState<'ready' | 'missing-token' | 'loading'>('loading');

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!containerRef.current) return;

    if (!token) {
      setStatus('missing-token');
      return;
    }

    let active = true;
    setStatus('loading');

    import('mapbox-gl')
      .then((module) => {
        if (!active) return;
        const mapboxgl = module.default;
        mapboxgl.accessToken = token;
        const map = new mapboxgl.Map({
          container: containerRef.current!,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [-73.9857, 40.7484],
          zoom: 12,
          pitch: 35,
        });

        const marker = new mapboxgl.Marker({ color: '#6ee7f9' })
          .setLngLat([-73.9857, 40.7484])
          .addTo(map);

        map.on('load', () => {
          if (active) {
            setStatus('ready');
          }
        });

        mapRef.current = map;
        return () => {
          marker.remove();
          map.remove();
        };
      })
      .catch(() => {
        if (active) {
          setStatus('missing-token');
        }
      });

    return () => {
      active = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`rounded-[24px] border border-white/10 bg-slate-900/70 p-2 ${className ?? ''}`}>
      {status === 'missing-token' ? (
        <div className="flex h-40 items-center justify-center rounded-[20px] border border-dashed border-white/10 bg-slate-800/70 px-4 text-center text-sm text-slate-400">
          Mapbox is ready for integration once NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is configured.
        </div>
      ) : (
        <div ref={containerRef} className="h-40 w-full rounded-[20px]" />
      )}
    </div>
  );
}
