# Wacky Custom Spawner Manager

A little web tool for managing custom spawner configurations. Upload YAML files, edit spawner profiles, and export your configurations with an intuitive interface.

## ✨ Features

- **YAML File Upload**: Upload and parse YAML spawner configuration files
- **Spawner Editor**: Edit all spawner properties with a comprehensive form
- **Prefab Search**: Search and select prefabs from a curated list (100+ items)
- **Profile Management**: Save, load, and manage multiple spawner profiles in localStorage
- **Search & Filter**: Quickly find spawners by name, prefab name, or prefab to copy
- **Export**: Download your spawner configurations as YAML files
- **Dark Mode**: Built-in dark mode support (toggle with `d` key)
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Getting Started

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm run dev
```

The app will be available at `http://localhost:5173/`

### Build

```bash
pnpm run build
```

### Linting

```bash
pnpm run lint
```

## 📋 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn UI components
│   ├── FileUpload.tsx  # YAML file upload
│   ├── SpawnerList.tsx # Spawner list view
│   ├── SpawnerEditor.tsx # Spawner editor modal
│   ├── ProfileManager.tsx # Profile management
│   └── Combobox.tsx    # Searchable combobox for prefabs
├── hooks/              # Custom React hooks
│   └── useSpawnerProfile.ts # Profile management hook
├── types/              # TypeScript type definitions
│   └── spawner.ts      # Spawner and profile types
├── utils/              # Utility functions
│   ├── yaml.ts         # YAML parsing and export
│   ├── storage.ts      # localStorage management
│   └── prefabs.ts      # Prefab data fetching
├── App.tsx             # Main app component
└── main.tsx            # Application entry point
```

## 🎯 Usage

1. **Upload a YAML file**: Click "Choose YAML File" to upload your spawner configuration
2. **Create new spawners**: Click "Add Spawner" in the spawner list
3. **Edit spawners**: Click the edit button on any spawner to modify its properties
4. **Search prefabs**: Both prefab fields have searchable comboboxes with 100+ prefab options
5. **Manage profiles**: Use the sidebar to create, load, or delete spawner profiles
6. **Export**: Click the download button to export your current spawners as a YAML file

## 📝 YAML Format & Spawner Fields

Supported spawner object structure with all available fields:

```yaml
spawners:
  - name: "BigNecks"
    prefabToCopy: "wood_wall_half"
    m_spawnTimer: 2
    m_onGroundOnly: false
    m_maxTotal: 10
    m_maxNear: 10
    m_farRadius: 20
    m_spawnRadius: 6
    m_setPatrolSpawnPoint: true
    m_triggerDistance: 10
    m_spawnIntervalSec: 2
    m_levelupChance: 100
    m_prefabName: "Neck"
    m_nearRadius: 1
    minLevel: 2
    maxLevel: 2
    HitPoints: 600
    mobTarget: false
    multiSpawn: 0
```

### Prefab Data Source

Prefab options are dynamically fetched from:
https://gist.githubusercontent.com/dsthedev/2beea417f614975d68fd2c2ded3c6baf/raw/0728213d50a9a8c19885ad3a2af879d8a47c365b/all_pieces_and_recipes.json

This provides a comprehensive list of available prefabs that can be used in both `prefabToCopy` and `m_prefabName` fields.

## 🛠️ Technologies

- **React 19**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **shadcn**: UI components
- **js-yaml**: YAML parsing
- **Lucide React**: Icons

## 📄 License

MIT
