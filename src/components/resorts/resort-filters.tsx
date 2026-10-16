"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface ResortFiltersProps {
  countries: string[];
}

export default function ResortFilters({ countries }: ResortFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentParams, setCurrentParams] = useState(searchParams.toString());

  useEffect(() => {
    setCurrentParams(searchParams.toString());
  }, [searchParams]);

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(currentParams);
    if (value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(currentParams);
    const currentTags = params.get('tags') || '';
    const tagsArray = currentTags ? currentTags.split(',') : [];

    if (tagsArray.includes(tag)) {
      const newTags = tagsArray.filter(t => t !== tag);
      params.set('tags', newTags.join(','));
    } else {
      params.set('tags', [...tagsArray, tag].join(','));
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <aside className="w-full lg:w-80 space-y-8">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-6">Filters</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <select
              className="w-full p-2 rounded border dark:bg-slate-800 dark:border-slate-700"
              defaultValue=""
              onChange={(e) => updateParams('country', e.target.value)}
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              className="w-full"
              onChange={(e) => updateParams('difficultyMin', e.target.value)}
            />
            <div className="flex justify-between text-xs mt-2">
              <span>1 (Easy)</span>
              <span>5 (Expert)</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {['powder', 'couloirs', 'trees', 'skiTouring', 'park'].map(tag => (
                <button
                  key={tag}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs hover:bg-blue-500 hover:text-white transition-colors"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}