import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/Combobox';
import type { SpawnerObject } from '@/types/spawner';
import { getPrefabs } from '@/utils/prefabs';
import { X } from 'lucide-react';

interface SpawnerEditorProps {
  spawner?: SpawnerObject;
  onSave: (spawner: SpawnerObject) => void;
  onCancel: () => void;
}

export function SpawnerEditor({ spawner, onSave, onCancel }: SpawnerEditorProps) {
  const [formData, setFormData] = useState<SpawnerObject>(
    spawner || {
      name: '',
      prefabToCopy: '',
      m_spawnTimer: 2,
      m_onGroundOnly: false,
      m_maxTotal: 10,
      m_maxNear: 10,
      m_farRadius: 20,
      m_spawnRadius: 6,
      m_setPatrolSpawnPoint: true,
      m_triggerDistance: 10,
      m_spawnIntervalSec: 2,
      m_levelupChance: 100,
      m_prefabName: '',
      m_nearRadius: 1,
      minLevel: 1,
      maxLevel: 1,
      HitPoints: 100,
      mobTarget: false,
      multiSpawn: 0,
    }
  );

  const [prefabs, setPrefabs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPrefabs().then(setPrefabs).then(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePrefabChange = (field: 'prefabToCopy' | 'm_prefabName') => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="fixed inset-4 z-50 flex flex-col overflow-auto md:inset-auto md:right-4 md:top-4 md:h-[90vh] md:w-[600px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>{spawner ? 'Edit Spawner' : 'New Spawner'}</CardTitle>
          <CardDescription>Configure spawner properties</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          {/* Basic Info */}
          <div className="col-span-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Spawner name"
              className="mt-1"
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="prefabToCopy">Prefab to Copy</Label>
            <Combobox
              options={prefabs}
              value={formData.prefabToCopy || ''}
              onChange={handlePrefabChange('prefabToCopy')}
              placeholder="Select or search prefab..."
              loading={loading}
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="m_prefabName">Prefab Name</Label>
            <Combobox
              options={prefabs}
              value={formData.m_prefabName || ''}
              onChange={handlePrefabChange('m_prefabName')}
              placeholder="Select or search prefab..."
              loading={loading}
            />
          </div>

          {/* Spawn Settings */}
          <div>
            <Label htmlFor="m_spawnTimer">Spawn Timer</Label>
            <Input
              id="m_spawnTimer"
              name="m_spawnTimer"
              type="number"
              value={formData.m_spawnTimer || 0}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="m_spawnIntervalSec">Spawn Interval (sec)</Label>
            <Input
              id="m_spawnIntervalSec"
              name="m_spawnIntervalSec"
              type="number"
              value={formData.m_spawnIntervalSec || 0}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="m_spawnRadius">Spawn Radius</Label>
            <Input
              id="m_spawnRadius"
              name="m_spawnRadius"
              type="number"
              value={formData.m_spawnRadius || 0}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="m_triggerDistance">Trigger Distance</Label>
            <Input
              id="m_triggerDistance"
              name="m_triggerDistance"
              type="number"
              value={formData.m_triggerDistance || 0}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          {/* Radius Settings */}
          <div>
            <Label htmlFor="m_nearRadius">Near Radius</Label>
            <Input
              id="m_nearRadius"
              name="m_nearRadius"
              type="number"
              value={formData.m_nearRadius || 0}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="m_maxNear">Max Near</Label>
            <Input
              id="m_maxNear"
              name="m_maxNear"
              type="number"
              value={formData.m_maxNear || 0}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="m_farRadius">Far Radius</Label>
            <Input
              id="m_farRadius"
              name="m_farRadius"
              type="number"
              value={formData.m_farRadius || 0}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="m_maxTotal">Max Total</Label>
            <Input
              id="m_maxTotal"
              name="m_maxTotal"
              type="number"
              value={formData.m_maxTotal || 0}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          {/* Creature Settings */}
          <div>
            <Label htmlFor="minLevel">Min Level</Label>
            <Input
              id="minLevel"
              name="minLevel"
              type="number"
              value={formData.minLevel || 0}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="maxLevel">Max Level</Label>
            <Input
              id="maxLevel"
              name="maxLevel"
              type="number"
              value={formData.maxLevel || 0}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="HitPoints">Hit Points</Label>
            <Input
              id="HitPoints"
              name="HitPoints"
              type="number"
              value={formData.HitPoints || 0}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="m_levelupChance">Levelup Chance</Label>
            <Input
              id="m_levelupChance"
              name="m_levelupChance"
              type="number"
              value={formData.m_levelupChance || 0}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="multiSpawn">Multi Spawn</Label>
            <Input
              id="multiSpawn"
              name="multiSpawn"
              type="number"
              value={formData.multiSpawn || 0}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          {/* Boolean Flags */}
          <div className="flex items-center gap-2">
            <input
              id="m_onGroundOnly"
              name="m_onGroundOnly"
              type="checkbox"
              checked={formData.m_onGroundOnly || false}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300"
            />
            <Label htmlFor="m_onGroundOnly" className="cursor-pointer">
              On Ground Only
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="m_setPatrolSpawnPoint"
              name="m_setPatrolSpawnPoint"
              type="checkbox"
              checked={formData.m_setPatrolSpawnPoint || false}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300"
            />
            <Label htmlFor="m_setPatrolSpawnPoint" className="cursor-pointer">
              Set Patrol Spawn Point
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="mobTarget"
              name="mobTarget"
              type="checkbox"
              checked={formData.mobTarget || false}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300"
            />
            <Label htmlFor="mobTarget" className="cursor-pointer">
              Mob Target
            </Label>
          </div>
        </div>
      </CardContent>
      <div className="border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex gap-2">
          <Button onClick={() => onSave(formData)} className="flex-1">
            Save
          </Button>
          <Button onClick={onCancel} variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
}
