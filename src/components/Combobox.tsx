import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComboboxProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Search...',
  loading = false,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);

  return (
    <div className="relative w-full">
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between"
        onClick={() => setOpen(!open)}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-slate-200 bg-white p-2 shadow-md dark:border-slate-800 dark:bg-slate-950">
          <Input
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
            disabled={loading}
          />

          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="py-2 text-center text-sm text-muted-foreground">
                Loading...
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="py-2 text-center text-sm text-muted-foreground">
                No results
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={cn(
                    'relative flex w-full cursor-pointer select-none items-center rounded px-2 py-1.5 text-sm outline-none hover:bg-slate-100 dark:hover:bg-slate-800',
                    value === option && 'bg-slate-100 dark:bg-slate-800'
                  )}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span className="flex-1 text-left">{option}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
