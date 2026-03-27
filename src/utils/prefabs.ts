import type { PrefabData } from '@/types/spawner';

let prefabCache: string[] | null = null;

export async function getPrefabs(): Promise<string[]> {
  if (prefabCache) {
    return prefabCache;
  }

  try {
    const response = await fetch(
      'https://gist.githubusercontent.com/dsthedev/2beea417f614975d68fd2c2ded3c6baf/raw/0728213d50a9a8c19885ad3a2af879d8a47c365b/all_pieces_and_recipes.json'
    );
    const data: PrefabData = await response.json();
    prefabCache = Object.keys(data).sort();
    return prefabCache;
  } catch (error) {
    console.error('Failed to fetch prefabs:', error);
    return [];
  }
}
