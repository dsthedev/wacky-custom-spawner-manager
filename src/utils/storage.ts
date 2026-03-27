import type { SpawnerProfile } from '@/types/spawner';

const STORAGE_KEY = 'spawner_profiles';

export function getProfiles(): SpawnerProfile[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveProfile(profile: SpawnerProfile): void {
  const profiles = getProfiles();
  const index = profiles.findIndex(p => p.id === profile.id);
  
  if (index >= 0) {
    profiles[index] = { ...profile, updatedAt: Date.now() };
  } else {
    profiles.push({ ...profile, createdAt: Date.now(), updatedAt: Date.now() });
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export function deleteProfile(id: string): void {
  const profiles = getProfiles().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export function getProfile(id: string): SpawnerProfile | undefined {
  return getProfiles().find(p => p.id === id);
}
