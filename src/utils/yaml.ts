import YAML from 'js-yaml';
import type { SpawnerObject } from '@/types/spawner';

function sanitizeSpawnersForExport(spawners: SpawnerObject[]): SpawnerObject[] {
  return spawners.map((spawner) => {
    const { id: _internalId, ...exportableSpawner } = spawner as SpawnerObject & {
      id?: unknown;
    };
    return exportableSpawner;
  });
}

export function parseYAML(yamlContent: string): SpawnerObject[] {
  try {
    const parsed = YAML.load(yamlContent);
    
    if (Array.isArray(parsed)) {
      return parsed.map((item, index) => ({
        ...item,
        id: (item as SpawnerObject).id || `spawner-${index}`,
      }));
    }
    
    if (parsed && typeof parsed === 'object' && 'spawners' in parsed) {
      const spawners = (parsed as { spawners: SpawnerObject[] }).spawners;
      if (Array.isArray(spawners)) {
        return spawners.map((item, index) => ({
          ...item,
          id: item.id || `spawner-${index}`,
        }));
      }
    }
    
    return [];
  } catch (error) {
    throw new Error(`Failed to parse YAML: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function spawnersToYAML(spawners: SpawnerObject[]): string {
  const sanitizedSpawners = sanitizeSpawnersForExport(spawners);

  return YAML.dump({ spawners: sanitizedSpawners }, {
    indent: 2,
    lineWidth: -1,
  });
}

export function exportSpawnersAsYAML(spawners: SpawnerObject[], filename: string = 'spawners.yaml'): void {
  const yaml = spawnersToYAML(spawners);
  const blob = new Blob([yaml], { type: 'text/yaml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
