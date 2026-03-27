import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComboboxProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  imageMap?: Map<string, string>;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Search...',
  imageMap,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = value
    ? options.filter(option => option.toLowerCase().includes(value.toLowerCase()))
    : options;

  const handleBlur = (e: React.FocusEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full" onBlur={handleBlur}>
      <div className="relative flex items-center">
        {imageMap && value && imageMap.get(value) && (
          <img
            src={imageMap.get(value)}
            alt={value}
            className="absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded object-contain"
          />
        )}
        <Input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={cn('mt-1 w-full', imageMap && value && imageMap.get(value) && 'pl-12')}
          autoComplete="off"
        />
      </div>

      {open && filteredOptions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-950">
          <div className="max-h-48 overflow-y-auto p-1">
            {filteredOptions.map((option) => {
              const imgUrl = imageMap?.get(option);
              return (
                <button
                  key={option}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full cursor-pointer select-none items-center rounded px-2 py-1.5 text-sm outline-none hover:bg-slate-100 dark:hover:bg-slate-800',
                    value === option && 'bg-slate-100 dark:bg-slate-800'
                  )}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 shrink-0',
                      value === option ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {imgUrl && (
                    <img
                      src={imgUrl}
                      alt={option}
                      className="mr-2 h-7 w-7 shrink-0 rounded object-contain"
                    />
                  )}
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
