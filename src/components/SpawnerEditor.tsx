import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Combobox } from '@/components/Combobox';
import { FieldLabel } from '@/components/FieldLabel';
import type { SpawnerObject } from '@/types/spawner';
import { X } from 'lucide-react';

type SuggestedRange = {
  min: number;
  max: number;
};

const SUGGESTED_RANGES: Partial<Record<keyof SpawnerObject, SuggestedRange>> = {
  m_spawnTimer: { min: 2, max: 600 },
  m_maxTotal: { min: 1, max: 20 },
  m_maxNear: { min: 1, max: 20 },
  m_farRadius: { min: 5, max: 50 },
  m_spawnRadius: { min: 1, max: 40 },
  m_triggerDistance: { min: 5, max: 40 },
  m_spawnIntervalSec: { min: 3, max: 601 },
  m_levelupChance: { min: 0, max: 100 },
  m_nearRadius: { min: 1, max: 10 },
  minLevel: { min: 1, max: 25 },
  maxLevel: { min: 1, max: 25 },
  HitPoints: { min: 100, max: 9999 },
};

interface SpawnerEditorProps {
  spawner?: SpawnerObject;
  onSave: (spawner: SpawnerObject) => void;
  onCancel: () => void;
  creatures?: string[];
  pieces?: string[];
  imageMap?: Map<string, string>;
}

function formatList(value?: string) {
  const items = value
    ?.split(',')
    .map(item => item.trim())
    .filter(Boolean) ?? [];

  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;

  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
}

function buildSpawnerDescription(spawner: SpawnerObject) {
  const source = spawner.prefabToCopy || 'a selected source prefab';
  const creatures = formatList(spawner.m_prefabName) || 'configured creatures';
  const minLevel = spawner.minLevel ?? 1;
  const maxLevel = spawner.maxLevel ?? minLevel;
  const levelText = minLevel === maxLevel ? `level ${minLevel}` : `levels ${minLevel}-${maxLevel}`;
  const radius = spawner.m_spawnRadius ?? 6;
  const interval = spawner.m_spawnIntervalSec ?? spawner.m_spawnTimer ?? 2;
  const maxTotal = spawner.m_maxTotal;
  const maxNear = spawner.m_maxNear;

  const clauses = [
    `Uses ${source} to spawn ${levelText} ${creatures}`,
    `within ${radius}m`,
    `every ${interval} seconds`,
  ];

  if (typeof maxNear === 'number') {
    clauses.push(`with up to ${maxNear} nearby`);
  }

  if (typeof maxTotal === 'number') {
    clauses.push(`and ${maxTotal} total active`);
  }

  return `${clauses.join(', ')}.`;
}

export function SpawnerEditor({ spawner, onSave, onCancel, creatures = [], pieces = [], imageMap }: SpawnerEditorProps) {
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

  const handleSliderChange = (field: keyof SpawnerObject) => (value: number[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value[0],
    }));
  };

  const renderNumberInput = (field: keyof SpawnerObject, label: string) => {
    const range = SUGGESTED_RANGES[field];
    const currentValue = Number(formData[field] ?? 0);
    const sliderValue = range
      ? [Math.min(range.max, Math.max(range.min, currentValue))]
      : [currentValue];
    const fieldStr = String(field);

    return (
      <div>
        <FieldLabel htmlFor={fieldStr} label={label} fieldKey={fieldStr} onSetDefault={handleSetDefault} />
        <Input
          id={fieldStr}
          name={fieldStr}
          type="number"
          value={currentValue}
          onChange={handleChange}
          className="mt-1"
        />
        {range && (
          <div className="mt-2 space-y-1">
            <Slider
              min={range.min}
              max={range.max}
              step={1}
              value={sliderValue}
              onValueChange={handleSliderChange(field)}
            />
            <p className="text-xs text-muted-foreground">Suggested range: {range.min} - {range.max}</p>
          </div>
        )}
      </div>
    );
  };

  const editorTitle = spawner
    ? `Edit ${formData.name?.trim() || spawner.name || 'Spawner'}`
    : 'New Spawner';
  const editorDescription = buildSpawnerDescription(formData);

  return (
    <Card className="fixed inset-4 z-50 flex flex-col overflow-auto md:inset-auto md:right-4 md:top-4 md:h-[90vh] md:w-[600px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>{editorTitle}</CardTitle>
          <CardDescription>{editorDescription}</CardDescription>
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
                imageMap={imageMap}
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
                imageMap={imageMap}
              />
            </div>
            <div>
              {renderNumberInput('minLevel', 'Min Level')}
            </div>
            <div>
              {renderNumberInput('maxLevel', 'Max Level')}
            </div>
            <div>
              {renderNumberInput('m_levelupChance', 'Levelup Chance')}
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
              {renderNumberInput('m_spawnTimer', 'Spawn Timer')}
            </div>
            <div>
              {renderNumberInput('m_spawnIntervalSec', 'Spawn Interval (sec)')}
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
              {renderNumberInput('m_triggerDistance', 'Trigger Distance')}
            </div>
            <div>
              {renderNumberInput('m_spawnRadius', 'Spawn Radius')}
            </div>
            <div>
              {renderNumberInput('m_nearRadius', 'Near Radius')}
            </div>
            <div>
              {renderNumberInput('m_farRadius', 'Far Radius')}
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
              {renderNumberInput('m_maxNear', 'Max Near')}
            </div>
            <div>
              {renderNumberInput('m_maxTotal', 'Max Total')}
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
              {renderNumberInput('HitPoints', 'Hit Points')}
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
