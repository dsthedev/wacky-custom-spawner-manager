import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { parseYAML } from '@/utils/yaml';
import type { SpawnerObject } from '@/types/spawner';

interface FileUploadProps {
  onUpload: (spawners: SpawnerObject[], filename: string) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const spawners = parseYAML(content);
      onUpload(spawners, file.name);
    } catch (error) {
      alert(`Error parsing file: ${error instanceof Error ? error.message : String(error)}`);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Spawner Configuration</CardTitle>
        <CardDescription>Upload a YAML file containing spawner definitions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".yaml,.yml"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            Choose YAML File
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
