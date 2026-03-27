export type FieldType = 'string' | 'int' | 'bool';

export interface FieldMeta {
  type: FieldType;
  default: string | number | boolean;
  description: string;
  gameEffect: string;
}

export const SPAWNER_FIELD_META: Record<string, FieldMeta> = {
  name: {
    type: 'string',
    default: '',
    description: 'Name of the monster spawner.',
    gameEffect:
      'Uniquely identifies the spawner in the world. This value is baked in at placement — changing it requires a full server reboot.',
  },
  prefabToCopy: {
    type: 'string',
    default: '',
    description: 'Prefab to copy when creating the spawner structure.',
    gameEffect:
      'Determines which in-world piece/structure this spawner is modeled after. Cannot be changed without a server reboot.',
  },
  m_spawnTimer: {
    type: 'int',
    default: 2,
    description:
      'Internal spawn accumulator. Increments by 2 each tick: m_spawnTimer += 2f — a spawn fires when m_spawnTimer > m_spawnIntervalSec.',
    gameEffect:
      'Acts as the running clock for the spawner. Vanilla updates every 2 seconds. Setting this higher gives the spawner a "head start" toward its next spawn; setting it lower adds a delay.',
  },
  m_onGroundOnly: {
    type: 'bool',
    default: false,
    description: 'When true, restricts monster spawns to ground-level positions only.',
    gameEffect:
      'Prevents mobs from appearing in mid-air, on rooftops, or inside structures. Useful for terrain-based encounters where you want enemies firmly on the ground.',
  },
  m_maxTotal: {
    type: 'int',
    default: 10,
    description: 'Maximum total monsters this spawner is allowed to have alive at once.',
    gameEffect:
      'Hard cap on population from this spawner across the entire world. The spawner pauses entirely until the count drops below this threshold.',
  },
  m_maxNear: {
    type: 'int',
    default: 10,
    description: 'Maximum monsters in the Near radius before the spawner pauses.',
    gameEffect:
      'Controls density directly around the spawner. Once this many mobs are within m_nearRadius, no new spawns occur — preventing a pile-up at the source.',
  },
  m_spawnRadius: {
    type: 'int',
    default: 6,
    description: 'Radius around the spawner within which new monsters can appear.',
    gameEffect:
      'The physical scatter range of spawn positions. Larger values spread mobs out more on creation; smaller values cluster them tightly at the spawner location.',
  },
  m_setPatrolSpawnPoint: {
    type: 'bool',
    default: true,
    description: 'When true, spawned monsters receive the spawner as their patrol anchor point.',
    gameEffect:
      'Keeps mobs tethered to the area around the spawner. Without this, mobs wander freely. With it, they patrol around their birth point — keeping the encounter zone contained.',
  },
  m_triggerDistance: {
    type: 'int',
    default: 10,
    description:
      'Distance at which a player activates this spawner. Players must be within this range for spawning to be renewed.',
    gameEffect:
      'Acts as an activation radius. If all players are farther away than this value, the spawner goes dormant and no new mobs spawn until someone enters the zone.',
  },
  m_spawnIntervalSec: {
    type: 'int',
    default: 2,
    description: 'Cooldown in seconds between individual spawn events.',
    gameEffect:
      'Controls how often the spawner produces mobs. Lower values create rapid waves; higher values create slower, more deliberate spawns. Works in tandem with m_spawnTimer.',
  },
  m_levelupChance: {
    type: 'int',
    default: 100,
    description: 'Percentage chance (0–100) that a spawned monster receives a level-up.',
    gameEffect:
      'Higher values produce more starred (stronger) mobs. Set to 0 to always spawn base-level creatures; set to 100 to always spawn leveled ones. Works within the minLevel–maxLevel range.',
  },
  m_prefabName: {
    type: 'string',
    default: '',
    description:
      'Name of the monster prefab(s) to spawn. Multiple entries are chosen randomly, weighted by each mob\'s m_weight value.',
    gameEffect:
      'Determines which creature type(s) this spawner produces. When multiple prefabs are listed, higher m_weight on a mob increases its selection probability. Lower weight = rarer spawn.',
  },
  m_nearRadius: {
    type: 'int',
    default: 1,
    description: 'Radius defining the "near" zone used by the m_maxNear cap.',
    gameEffect:
      'Mobs within this distance count toward m_maxNear. A small value means only mobs right next to the spawner are counted as "near"; a larger value casts a wider net before pausing.',
  },
  m_farRadius: {
    type: 'int',
    default: 20,
    description: 'Radius defining the "far" zone used for population checks.',
    gameEffect:
      'Mobs within this distance contribute to far-zone population tracking. Acts as the outer boundary the spawner uses to decide whether the area is already "full" before spawning more.',
  },
  minLevel: {
    type: 'int',
    default: 1,
    description: 'Minimum star level for monsters spawned by this spawner.',
    gameEffect:
      'Sets the floor on mob difficulty. All spawned creatures will be at least this many stars. Combine with maxLevel and m_levelupChance to tune encounter difficulty.',
  },
  maxLevel: {
    type: 'int',
    default: 1,
    description: 'Maximum star level for monsters spawned by this spawner.',
    gameEffect:
      'Caps how powerful spawned mobs can be. Creatures will never exceed this star rating. Use a higher value than minLevel to allow a range of difficulty.',
  },
  HitPoints: {
    type: 'int',
    default: 100,
    description:
      'Health of the spawner structure itself. 0 = indestructible. 400 = equivalent to a vanilla portal.',
    gameEffect:
      'Determines how much damage the spawner piece can absorb before being destroyed. Use 0 to make it permanently indestructible. Affects whether players or mobs can eliminate the source.',
  },
  mobTarget: {
    type: 'bool',
    default: false,
    description:
      'Marks this piece as a mob target, setting m_randomTarget, m_primaryTarget, and m_targetNonPlayerBuilt.',
    gameEffect:
      'When enabled, mobs will actively seek out and attack the spawner structure. Adds a self-preservation threat — mobs protect or destroy their own source.',
  },
  multiSpawn: {
    type: 'int',
    default: 0,
    description:
      'Number of extra mobs spawned simultaneously per spawn event. Default 0 spawns one mob at a time.',
    gameEffect:
      'Enables burst spawning without needing a large spawn radius. Pair with a high m_spawnIntervalSec to fill an area in discrete waves. Avoid large m_spawnRadius when using this — the mobs should stack close together.',
  },
};
