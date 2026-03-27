import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { SPAWNER_FIELD_META, type FieldType } from '@/components/spawner-field-meta';
import { cn } from '@/lib/utils';

interface FieldLabelProps {
  htmlFor: string;
  label: string;
  fieldKey: string;
  onSetDefault: (field: string, value: string | number | boolean) => void;
  labelClassName?: string;
}

const TYPE_BADGE: Record<FieldType, string> = {
  string: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  int: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  bool: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
};

export function FieldLabel({
  htmlFor,
  label,
  fieldKey,
  onSetDefault,
  labelClassName,
}: FieldLabelProps) {
  const meta = SPAWNER_FIELD_META[fieldKey];

  if (!meta) {
    return (
      <Label htmlFor={htmlFor} className={labelClassName}>
        {label}
      </Label>
    );
  }

  const defaultDisplay =
    typeof meta.default === 'boolean' ? (meta.default ? 'true' : 'false') : String(meta.default);

  return (
    <div className="flex items-center gap-1">
      <Label htmlFor={htmlFor} className={labelClassName}>
        {label}
      </Label>
      <HoverCard openDelay={200} closeDelay={150}>
        <HoverCardTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center text-muted-foreground hover:text-foreground focus:outline-none"
            aria-label={`Info for ${label}`}
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent side="right" align="start">
          <div className="space-y-3">
            {/* Type + default row */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'rounded px-1.5 py-0.5 font-mono text-xs font-semibold',
                  TYPE_BADGE[meta.type],
                )}
              >
                {meta.type}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onSetDefault(fieldKey, meta.default)}
                className="h-6 px-2 text-xs"
              >
                Set default: {defaultDisplay}
              </Button>
            </div>

            {/* Description */}
            <p className="text-sm leading-snug">{meta.description}</p>

            {/* Game effect */}
            <div className="border-t border-border pt-2">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Game Effect
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">{meta.gameEffect}</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
