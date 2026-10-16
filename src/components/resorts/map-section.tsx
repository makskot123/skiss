"use client";

import React from 'react';
import MapContainer from '@/components/ui/map-container';
import { useRouter } from 'next/navigation';

interface MapSectionProps {
  resorts: any[];
}

export default function MapSection({ resorts }: MapSectionProps) {
  const router = useRouter();

  const handleMarkerClick = (resort: any) => {
    const url = new URL(window.location.href);
    url.searchParams.set('slug', resort.slug);
    router.push(url.toString());
  };

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-2xl font-bold dark:text-white">Interactive Map</h2>
        <p className="text-gray-600 dark:text-gray-400">Explore resorts visually and select from the map.</p>
      </div>
      <MapContainer
        resorts={resorts}
        onMarkerClick={handleMarkerClick}
      />
    </section>
  );
}