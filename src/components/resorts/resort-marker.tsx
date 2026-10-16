import * as React from 'react';
import { Resort } from '@/lib/zods';

interface ResortMarkerProps {
  resort: Resort;
}

const ResortMarker: React.FC<ResortMarkerProps> = ({ resort }) => {
  return (
    <div className="group relative cursor-pointer">
      <div className="absolute z-10 bottom-0 flex flex-col items-center">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          <p className="text-xs font-bold dark:text-white">{resort.name}</p>
          <p className="text-[10px] text-gray-500">{resort.region}</p>
        </div>
      </div>
      <div className="w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-lg group-hover:scale-125 transition-transform" />
    </div>
  );
};

export default ResortMarker;