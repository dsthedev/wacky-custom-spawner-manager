import { useState, useEffect } from 'react';

export interface PrefabData {
  creatures: string[];
  pieces: string[];
  imageMap: Map<string, string>;
  loading: boolean;
}

export function usePrefabData(): PrefabData {
  const [creatures, setCreatures] = useState<string[]>([]);
  const [pieces, setPieces] = useState<string[]>([]);
  const [imageMap, setImageMap] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [creaturesRes, csvRes] = await Promise.all([
          fetch('/creatures-pieces.json'),
          fetch('/images_raw_urls.csv'),
        ]);

        const creaturesData = await creaturesRes.json();
        setCreatures(creaturesData.Creatures ?? []);
        setPieces(creaturesData.Pieces ?? []);

        const csvText = await csvRes.text();
        const lines = csvText.trim().split('\n').slice(1); // skip header row
        const map = new Map<string, string>();
        for (const line of lines) {
          const commaIdx = line.indexOf(',');
          if (commaIdx === -1) continue;
          const filename = line.slice(0, commaIdx).trim(); // e.g. "Abomination.png"
          const url = line.slice(commaIdx + 1).trim();
          const key = filename.replace(/\.png$/i, ''); // strip extension → "Abomination"
          map.set(key, url);
        }
        setImageMap(map);
      } catch (err) {
        console.error('Failed to load prefab data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { creatures, pieces, imageMap, loading };
}
