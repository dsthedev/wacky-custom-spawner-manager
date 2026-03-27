import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus } from 'lucide-react';
import type { SpawnerProfile } from '@/types/spawner';

interface ProfileManagerProps {
  profiles: SpawnerProfile[];
  currentProfile: SpawnerProfile | null;
  onLoadProfile: (id: string) => void;
  onDeleteProfile: (id: string) => void;
  onNewProfile: () => void;
}

export function ProfileManager({
  profiles,
  currentProfile,
  onLoadProfile,
  onDeleteProfile,
  onNewProfile,
}: ProfileManagerProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Saved Profiles</CardTitle>
            <CardDescription>Manage your spawner profiles</CardDescription>
          </div>
          <Button onClick={onNewProfile} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Profile
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {profiles.length === 0 ? (
            <p className="text-sm text-muted-foreground">No profiles yet</p>
          ) : (
            profiles.map((profile) => (
              <div
                key={profile.id}
                className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors ${
                  currentProfile?.id === profile.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900'
                }`}
                onClick={() => onLoadProfile(profile.id)}
              >
                <div className="flex-1">
                  <p className="font-semibold">{profile.name}</p>
                  <div className="flex gap-2 pt-1">
                    <Badge variant="outline" className="text-xs">
                      {profile.spawners.length} spawners
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Updated {new Date(profile.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProfile(profile.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
