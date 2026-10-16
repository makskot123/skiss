import * as React from 'react';
import Map, { CameraPosition, Marker } from 'react-map-gl';
import ResortMarker from '@/components/resorts/resort-marker';
import { Resort } from '@/lib/zods';

interface MapContainerProps {
  resorts: Resort[];
  onMarkerClick?: (resort: Resort) => void;
}

const MAP_STYLE = "https://demotiles.maplibre.org/search"; // Placeholder

const MapContainer: React.FC<MapContainerProps> = ({ resorts, onMarkerClick }) => {
  const [viewState, setViewState] = React.useState<CameraPosition>({
    coordinates: [5.0, 46.0], // Center of the Alps
    zoom: 5,
  });

  const onViewChange = (e: any) => setViewState(e.viewState);

  return (
    <div className="h-[600px] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
      <Map
        {...viewState}
        onViewChange={onViewChange}
        mapStyle={MAP_STYLE}
        markers={resorts.map((resort) => (
          <Marker
            key={resort.slug}
            longitude={resort.longitude || 5.0}
            latitude={resort.latitude || 46.0}
            onClick={() => onMarkerClick?.(resort)}
          >
            <ResortMarker resort={resort} />
          </Marker>
        ))}
      />
    </div>
  );
};

export default MapContainer;