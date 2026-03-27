import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUpload } from '@/components/FileUpload';
import { SpawnerList } from '@/components/SpawnerList';
import { SpawnerEditor } from '@/components/SpawnerEditor';
import { ProfileManager } from '@/components/ProfileManager';
import { useSpawnerProfile } from '@/hooks/useSpawnerProfile';
import { usePrefabData } from '@/hooks/usePrefabData';
import { exportSpawnersAsYAML, spawnersToYAML } from '@/utils/yaml';
import { generateWackySpawners } from '@/utils/wackyData';
import type { SpawnerObject } from '@/types/spawner';
import { Check, Copy, Download, Sprout } from 'lucide-react';

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
  const [copySucceeded, setCopySucceeded] = useState(false);

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

  const handleLoadWackyData = () => {
    try {
      const generatedSpawners = generateWackySpawners(creatures, pieces);
      const generatedName = `Wacky Data ${new Date().toLocaleDateString()} (${generatedSpawners.length})`;
      const profile = createProfile(generatedName, generatedSpawners, 'Auto-generated randomized spawner profile');
      setSpawners(profile.spawners);
      setProfileName(profile.name);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to generate wacky data');
    }
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

  const handleCopyProfile = async () => {
    if (spawners.length === 0) {
      alert('No spawners to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(spawnersToYAML(spawners));
      setCopySucceeded(true);
      window.setTimeout(() => setCopySucceeded(false), 2000);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to copy profile');
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="flex items-center text-4xl font-bold"><Sprout size={68} /> Spawner Manager</h1>
          <p className="mt-2 text-muted-foreground">
            Upload, edit, and manage WackySpawner <code>yml</code> configurations
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
              onLoadWackyData={handleLoadWackyData}
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
                  <Button onClick={handleSaveAsProfile} size="sm">
                    {currentProfile ? 'Update' : 'Save'}
                  </Button>
                  <Button onClick={handleCopyProfile} variant="outline" size="sm">
                    {copySucceeded ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copySucceeded ? 'Copied' : 'Copy'}
                  </Button>
                  <Button onClick={handleExport} className="flex-1" variant="amber" size="sm">
                    <Download className="h-4 w-4" />
                    Download
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
