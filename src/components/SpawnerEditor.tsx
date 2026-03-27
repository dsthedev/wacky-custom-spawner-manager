import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/Combobox';
import { FieldLabel } from '@/components/FieldLabel';
import type { SpawnerObject } from '@/types/spawner';
import { getCreatures, getPieces } from '@/utils/prefabs';
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

  const pieces = getPieces();
  const creatures = getCreatures();

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

  const handleSetDefault = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      <CardContent className="flex-1 space-y-3 overflow-y-auto">

        {/* ── Identity ─────────────────────────────────────────────── slate */}
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/50">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Identity
          </h4>
          <div className="space-y-3">
            <div>
              <FieldLabel htmlFor="name" label="Name *" fieldKey="name" onSetDefault={handleSetDefault} />
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Spawner name"
                className="mt-1"
              />
            </div>
            <div>
              <FieldLabel htmlFor="prefabToCopy" label="Prefab to Copy" fieldKey="prefabToCopy" onSetDefault={handleSetDefault} />
              <Combobox
                options={pieces}
                value={formData.prefabToCopy || ''}
                onChange={handlePrefabChange('prefabToCopy')}
                placeholder="Select or search piece..."
              />
            </div>
          </div>
        </section>

        {/* ── Creature ─────────────────────────────────────────────── emerald */}
        <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800/50 dark:bg-emerald-950/20">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Creature
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <FieldLabel htmlFor="m_prefabName" label="Prefab Name" fieldKey="m_prefabName" onSetDefault={handleSetDefault} />
              <Combobox
                options={creatures}
                value={formData.m_prefabName || ''}
                onChange={handlePrefabChange('m_prefabName')}
                placeholder="Select or search creature..."
              />
            </div>
            <div>
              <FieldLabel htmlFor="minLevel" label="Min Level" fieldKey="minLevel" onSetDefault={handleSetDefault} />
              <Input id="minLevel" name="minLevel" type="number" value={formData.minLevel || 0} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <FieldLabel htmlFor="maxLevel" label="Max Level" fieldKey="maxLevel" onSetDefault={handleSetDefault} />
              <Input id="maxLevel" name="maxLevel" type="number" value={formData.maxLevel || 0} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <FieldLabel htmlFor="m_levelupChance" label="Levelup Chance" fieldKey="m_levelupChance" onSetDefault={handleSetDefault} />
              <Input id="m_levelupChance" name="m_levelupChance" type="number" value={formData.m_levelupChance || 0} onChange={handleChange} className="mt-1" />
            </div>
          </div>
        </section>

        {/* ── Timing ───────────────────────────────────────────────── amber */}
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800/50 dark:bg-amber-950/20">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Timing
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel htmlFor="m_spawnTimer" label="Spawn Timer" fieldKey="m_spawnTimer" onSetDefault={handleSetDefault} />
              <Input id="m_spawnTimer" name="m_spawnTimer" type="number" value={formData.m_spawnTimer || 0} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <FieldLabel htmlFor="m_spawnIntervalSec" label="Spawn Interval (sec)" fieldKey="m_spawnIntervalSec" onSetDefault={handleSetDefault} />
              <Input id="m_spawnIntervalSec" name="m_spawnIntervalSec" type="number" value={formData.m_spawnIntervalSec || 0} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <FieldLabel htmlFor="multiSpawn" label="Multi Spawn" fieldKey="multiSpawn" onSetDefault={handleSetDefault} />
              <Input id="multiSpawn" name="multiSpawn" type="number" value={formData.multiSpawn || 0} onChange={handleChange} className="mt-1" />
            </div>
          </div>
        </section>

        {/* ── Proximity ────────────────────────────────────────────── sky */}
        <section className="rounded-lg border border-sky-200 bg-sky-50 p-3 dark:border-sky-800/50 dark:bg-sky-950/20">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400">
            Proximity
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel htmlFor="m_triggerDistance" label="Trigger Distance" fieldKey="m_triggerDistance" onSetDefault={handleSetDefault} />
              <Input id="m_triggerDistance" name="m_triggerDistance" type="number" value={formData.m_triggerDistance || 0} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <FieldLabel htmlFor="m_spawnRadius" label="Spawn Radius" fieldKey="m_spawnRadius" onSetDefault={handleSetDefault} />
              <Input id="m_spawnRadius" name="m_spawnRadius" type="number" value={formData.m_spawnRadius || 0} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <FieldLabel htmlFor="m_nearRadius" label="Near Radius" fieldKey="m_nearRadius" onSetDefault={handleSetDefault} />
              <Input id="m_nearRadius" name="m_nearRadius" type="number" value={formData.m_nearRadius || 0} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <FieldLabel htmlFor="m_farRadius" label="Far Radius" fieldKey="m_farRadius" onSetDefault={handleSetDefault} />
              <Input id="m_farRadius" name="m_farRadius" type="number" value={formData.m_farRadius || 0} onChange={handleChange} className="mt-1" />
            </div>
          </div>
        </section>

        {/* ── Population ───────────────────────────────────────────── rose */}
        <section className="rounded-lg border border-rose-200 bg-rose-50 p-3 dark:border-rose-800/50 dark:bg-rose-950/20">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
            Population
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel htmlFor="m_maxNear" label="Max Near" fieldKey="m_maxNear" onSetDefault={handleSetDefault} />
              <Input id="m_maxNear" name="m_maxNear" type="number" value={formData.m_maxNear || 0} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <FieldLabel htmlFor="m_maxTotal" label="Max Total" fieldKey="m_maxTotal" onSetDefault={handleSetDefault} />
              <Input id="m_maxTotal" name="m_maxTotal" type="number" value={formData.m_maxTotal || 0} onChange={handleChange} className="mt-1" />
            </div>
          </div>
        </section>

        {/* ── Behavior ─────────────────────────────────────────────── violet */}
        <section className="rounded-lg border border-violet-200 bg-violet-50 p-3 dark:border-violet-800/50 dark:bg-violet-950/20">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            Behavior
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <input id="m_onGroundOnly" name="m_onGroundOnly" type="checkbox" checked={formData.m_onGroundOnly || false} onChange={handleChange} className="h-4 w-4 rounded border-slate-300" />
              <FieldLabel htmlFor="m_onGroundOnly" label="On Ground Only" fieldKey="m_onGroundOnly" onSetDefault={handleSetDefault} labelClassName="cursor-pointer" />
            </div>
            <div className="flex items-center gap-2">
              <input id="m_setPatrolSpawnPoint" name="m_setPatrolSpawnPoint" type="checkbox" checked={formData.m_setPatrolSpawnPoint || false} onChange={handleChange} className="h-4 w-4 rounded border-slate-300" />
              <FieldLabel htmlFor="m_setPatrolSpawnPoint" label="Set Patrol Spawn Point" fieldKey="m_setPatrolSpawnPoint" onSetDefault={handleSetDefault} labelClassName="cursor-pointer" />
            </div>
          </div>
        </section>

        {/* ── Structure ────────────────────────────────────────────── orange */}
        <section className="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-800/50 dark:bg-orange-950/20">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-400">
            Structure
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel htmlFor="HitPoints" label="Hit Points" fieldKey="HitPoints" onSetDefault={handleSetDefault} />
              <Input id="HitPoints" name="HitPoints" type="number" value={formData.HitPoints || 0} onChange={handleChange} className="mt-1" />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input id="mobTarget" name="mobTarget" type="checkbox" checked={formData.mobTarget || false} onChange={handleChange} className="h-4 w-4 rounded border-slate-300" />
              <FieldLabel htmlFor="mobTarget" label="Mob Target" fieldKey="mobTarget" onSetDefault={handleSetDefault} labelClassName="cursor-pointer" />
            </div>
          </div>
        </section>

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
