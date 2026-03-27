import type { SpawnerObject } from '@/types/spawner';

const BIOME_PREFIXES = [
  'Meadows',
  'BlackForest',
  'Swamp',
  'Mountain',
  'Plains',
  'Mistlands',
  'Ashlands',
  'DeepNorth',
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBool(chanceTrue: number): boolean {
  return Math.random() < chanceTrue;
}

function pickRandom<T>(items: T[]): T {
  return items[randomInt(0, items.length - 1)];
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getCreatureStrengthMultiplier(creature: string): number {
  const name = creature.toLowerCase();
  if (/queen|fenring|seeker|soldier|gjall|berserker|lox|abomination/.test(name)) return 3.2;
  if (/troll|draugr|wolf|fuling|wraith|ulv|asksvin/.test(name)) return 2.1;
  if (/boar|neck|deer|greydwarf|skeleton/.test(name)) return 1.0;
  return 1.5;
}

export function generateWackySpawners(creatures: string[], pieces: string[]): SpawnerObject[] {
  if (creatures.length === 0 || pieces.length === 0) {
    throw new Error('Prefab resources are still loading. Try again in a moment.');
  }

  const count = randomInt(69, 420);
  const creaturePool = shuffle(creatures);
  const piecePool = shuffle(pieces);
  const result: SpawnerObject[] = [];

  for (let index = 0; index < count; index += 1) {
    const creature = creaturePool[index % creaturePool.length] ?? pickRandom(creatures);
    const piece = piecePool[index % piecePool.length] ?? pickRandom(pieces);
    const biome = pickRandom(BIOME_PREFIXES);
    const minLevel = randomInt(1, 4);
    const maxLevel = Math.max(minLevel, Math.min(12, minLevel + randomInt(0, 4)));
    const spawnTiming = randomInt(5, 55);
    const strengthMultiplier = getCreatureStrengthMultiplier(creature);

    const maxTotal = randomInt(2, 18);
    const maxNear = randomInt(1, Math.max(1, maxTotal));
    const spawnRadius = randomInt(3, 24);
    const nearRadius = randomInt(1, 8);
    const farRadius = Math.max(spawnRadius + randomInt(4, 24), randomInt(12, 48));

    result.push({
      name: `${biome}_${creature}_${String(index + 1).padStart(3, '0')}`,
      prefabToCopy: piece,
      m_spawnTimer: spawnTiming,
      m_onGroundOnly: randomBool(0.78),
      m_maxTotal: maxTotal,
      m_maxNear: maxNear,
      m_farRadius: farRadius,
      m_spawnRadius: spawnRadius,
      m_setPatrolSpawnPoint: randomBool(0.62),
      m_triggerDistance: randomInt(8, 42),
      m_spawnIntervalSec: spawnTiming,
      m_levelupChance: randomInt(5, 90),
      m_prefabName: creature,
      m_nearRadius: nearRadius,
      minLevel,
      maxLevel,
      HitPoints: Math.round(randomInt(120, 420) * strengthMultiplier * (0.8 + maxLevel * 0.16)),
      mobTarget: randomBool(0.36),
      multiSpawn: randomInt(0, 4),
    });
  }

  return result;
}