"use client";

import React, { useState, useEffect } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface Resort {
  name: string;
  slug: string;
  longitude: number;
  latitude: number;
  description: string;
  terrainDifficulty: number;
}

interface MapContainerProps {
  resorts: Resort[];
  center: [number, number];
  zoom: number;
}

export default function MapContainer({ resorts, center, zoom }: MapContainerProps) {
  const [mapStyle, setMapStyle] = useState('https://demotiles.maplibre.org/style.json');

  return (
    <div className="h-[600px] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner bg-slate-100 dark:bg-slate-900">
      <Map
        initialViewState={{
          longitude: center[0],
          latitude: center[1],
          zoom: zoom,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
      >
        <NavigationControl position="top-right" />
        {resorts.map((resort) => (
          <Marker
            key={resort.slug}
            longitude={resort.longitude}
            latitude={resort.latitude}
            color="#3b82f6"
          >
            <div className="relative">
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-600 rounded-full animate-ping" />
              <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white dark:border-slate-900 shadow-md" />
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}
