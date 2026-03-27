import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUpload } from '@/components/FileUpload';
import { SpawnerList } from '@/components/SpawnerList';
import { SpawnerEditor } from '@/components/SpawnerEditor';
import { ProfileManager } from '@/components/ProfileManager';
import { useSpawnerProfile } from '@/hooks/useSpawnerProfile';
import { usePrefabData } from '@/hooks/usePrefabData';
import { exportSpawnersAsYAML } from '@/utils/yaml';
import type { SpawnerObject } from '@/types/spawner';
import { Download } from 'lucide-react';

export function App() {
  const {
    currentProfile,
    setCurrentProfile,
    profiles,
    loadProfile,
    createProfile,
    updateProfile,
    removeProfile,
  } = useSpawnerProfile();

  const { creatures, pieces, imageMap } = usePrefabData();

  const [spawners, setSpawners] = useState<SpawnerObject[]>(currentProfile?.spawners || []);
  const [editingSpawner, setEditingSpawner] = useState<{
    spawner: SpawnerObject;
    index: number;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState(currentProfile?.name || '');

  useEffect(() => {
    setSpawners(currentProfile?.spawners || []);
    setProfileName(currentProfile?.name || '');
  }, [currentProfile]);

  const handleFileUpload = (uploadedSpawners: SpawnerObject[], filename: string) => {
    const name = filename.replace(/\.[^/.]+$/, '');
    const profile = createProfile(name, uploadedSpawners);
    setSpawners(profile.spawners);
  };

  const handleAddSpawner = () => {
    setEditingSpawner({
      spawner: { name: '', entity: '', weight: 1 },
      index: spawners.length,
    });
    setIsEditing(true);
  };

  const handleEditSpawner = (spawner: SpawnerObject, index: number) => {
    setEditingSpawner({ spawner, index });
    setIsEditing(true);
  };

  const handleSaveSpawner = (spawner: SpawnerObject) => {
    if (editingSpawner) {
      const newSpawners = [...spawners];
      if (editingSpawner.index >= newSpawners.length) {
        newSpawners.push(spawner);
      } else {
        newSpawners[editingSpawner.index] = spawner;
      }
      setSpawners(newSpawners);
      if (currentProfile) {
        updateProfile(newSpawners);
      }
    }
    setEditingSpawner(null);
    setIsEditing(false);
  };

  const handleDeleteSpawner = (index: number) => {
    const newSpawners = spawners.filter((_, i) => i !== index);
    setSpawners(newSpawners);
    if (currentProfile) {
      updateProfile(newSpawners);
    }
  };

  const handleNewProfile = () => {
    setCurrentProfile(null);
    setSpawners([]);
    setProfileName('');
  };

  const handleSaveAsProfile = () => {
    if (!profileName.trim()) {
      alert('Please enter a profile name');
      return;
    }

    if (currentProfile) {
      updateProfile(spawners, profileName);
    } else {
      createProfile(profileName, spawners);
    }
    setProfileName('');
  };

  const handleExport = () => {
    if (spawners.length === 0) {
      alert('No spawners to export');
      return;
    }
    const filename = currentProfile ? `${currentProfile.name}.yaml` : 'spawners.yaml';
    exportSpawnersAsYAML(spawners, filename);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Spawner Manager</h1>
          <p className="mt-2 text-muted-foreground">
            Upload, edit, and manage spawner configurations
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            <FileUpload onUpload={handleFileUpload} />
            <ProfileManager
              profiles={profiles}
              currentProfile={currentProfile}
              onLoadProfile={loadProfile}
              onDeleteProfile={removeProfile}
              onNewProfile={handleNewProfile}
            />

            {(currentProfile || spawners.length > 0) && (
              <div className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <h3 className="font-semibold">Current Profile</h3>
                <Input
                  placeholder="Profile name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveAsProfile} className="flex-1" size="sm">
                    {currentProfile ? 'Update' : 'Save'} Profile
                  </Button>
                  <Button onClick={handleExport} variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {spawners.length > 0 ? (
              <SpawnerList
                spawners={spawners}
                onEdit={handleEditSpawner}
                onDelete={handleDeleteSpawner}
                onAdd={handleAddSpawner}
                imageMap={imageMap}
              />
            ) : (
              <div className="rounded-lg border-2 border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
                <p className="text-muted-foreground">
                  Upload a YAML file or create a new spawner to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditing && editingSpawner && (
        <SpawnerEditor
          spawner={editingSpawner.spawner}
          onSave={handleSaveSpawner}
          onCancel={() => {
            setIsEditing(false);
            setEditingSpawner(null);
          }}
          creatures={creatures}
          pieces={pieces}
          imageMap={imageMap}
        />
      )}
    </div>
  );
}

export default App;
