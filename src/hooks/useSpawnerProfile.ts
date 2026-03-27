import { useState, useCallback } from 'react';
import type { SpawnerProfile, SpawnerObject } from '@/types/spawner';
import { getProfiles, saveProfile, deleteProfile, getProfile } from '@/utils/storage';

export function useSpawnerProfile() {
  const [currentProfile, setCurrentProfile] = useState<SpawnerProfile | null>(null);
  const [profiles, setProfiles] = useState<SpawnerProfile[]>(getProfiles());

  const refreshProfiles = useCallback(() => {
    setProfiles(getProfiles());
  }, []);

  const loadProfile = useCallback((id: string) => {
    const profile = getProfile(id);
    if (profile) {
      setCurrentProfile(profile);
      return true;
    }
    return false;
  }, []);

  const createProfile = useCallback((name: string, spawners: SpawnerObject[], description?: string) => {
    const newProfile: SpawnerProfile = {
      id: `profile-${Date.now()}`,
      name,
      description,
      spawners,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveProfile(newProfile);
    setCurrentProfile(newProfile);
    refreshProfiles();
    return newProfile;
  }, [refreshProfiles]);

  const updateProfile = useCallback((spawners: SpawnerObject[], name?: string) => {
    if (!currentProfile) return;
    const updated: SpawnerProfile = {
      ...currentProfile,
      spawners,
      name: name || currentProfile.name,
      updatedAt: Date.now(),
    };
    saveProfile(updated);
    setCurrentProfile(updated);
    refreshProfiles();
  }, [currentProfile, refreshProfiles]);

  const removeProfile = useCallback((id: string) => {
    deleteProfile(id);
    if (currentProfile?.id === id) {
      setCurrentProfile(null);
    }
    refreshProfiles();
  }, [currentProfile, refreshProfiles]);

  return {
    currentProfile,
    setCurrentProfile,
    profiles,
    loadProfile,
    createProfile,
    updateProfile,
    removeProfile,
    refreshProfiles,
  };
}
