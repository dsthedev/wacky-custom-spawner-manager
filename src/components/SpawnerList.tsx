import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Accordion as RadixAccordion } from "radix-ui"
import { cn } from "@/lib/utils"
import { ChevronDown, Plus, Trash2, Edit2 } from "lucide-react"
import type { SpawnerObject } from "@/types/spawner"

interface SpawnerListProps {
  spawners: SpawnerObject[]
  onEdit: (spawner: SpawnerObject, index: number) => void
  onDelete: (index: number) => void
  onAdd: () => void
  imageMap?: Map<string, string>
}

type FieldDef = { key: keyof SpawnerObject; label: string }
type CategoryDef = { name: string; color: string; fields: FieldDef[] }

const CATEGORIES: CategoryDef[] = [

  {
    name: "Creature",
    color: "emerald",
    fields: [
      { key: "m_prefabName", label: "Prefab Name" },
      { key: "minLevel", label: "Min Level" },
      { key: "maxLevel", label: "Max Level" },
      { key: "m_levelupChance", label: "Levelup Chance" },
    ],
  },
  {
    name: "Timing",
    color: "amber",
    fields: [
      { key: "m_spawnTimer", label: "Spawn Timer" },
      { key: "m_spawnIntervalSec", label: "Spawn Interval (sec)" },
      { key: "multiSpawn", label: "Multi Spawn" },
    ],
  },
  {
    name: "Proximity",
    color: "sky",
    fields: [
      { key: "m_triggerDistance", label: "Trigger Distance" },
      { key: "m_spawnRadius", label: "Spawn Radius" },
      { key: "m_nearRadius", label: "Near Radius" },
      { key: "m_farRadius", label: "Far Radius" },
    ],
  },
  {
    name: "Population",
    color: "rose",
    fields: [
      { key: "m_maxNear", label: "Max Near" },
      { key: "m_maxTotal", label: "Max Total" },
    ],
  },
  {
    name: "Behavior",
    color: "violet",
    fields: [
      { key: "m_onGroundOnly", label: "On Ground Only" },
      { key: "m_setPatrolSpawnPoint", label: "Set Patrol Spawn Point" },
    ],
  },
  {
    name: "Structure",
    color: "orange",
    fields: [
      { key: "prefabToCopy", label: "" },
      { key: "HitPoints", label: "Hit Points" },
      { key: "mobTarget", label: "Mob Target" },
    ],
  },
]

const COLOR_CLASSES: Record<
  string,
  { border: string; bg: string; text: string }
> = {
  slate: {
    border: "border-slate-200 dark:border-slate-700",
    bg: "bg-slate-50 dark:bg-slate-900/50",
    text: "text-slate-500 dark:text-slate-400",
  },
  emerald: {
    border: "border-emerald-200 dark:border-emerald-800/50",
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  amber: {
    border: "border-amber-200 dark:border-amber-800/50",
    bg: "bg-amber-50 dark:bg-amber-950/20",
    text: "text-amber-600 dark:text-amber-400",
  },
  sky: {
    border: "border-sky-200 dark:border-sky-800/50",
    bg: "bg-sky-50 dark:bg-sky-950/20",
    text: "text-sky-600 dark:text-sky-400",
  },
  rose: {
    border: "border-rose-200 dark:border-rose-800/50",
    bg: "bg-rose-50 dark:bg-rose-950/20",
    text: "text-rose-600 dark:text-rose-400",
  },
  violet: {
    border: "border-violet-200 dark:border-violet-800/50",
    bg: "bg-violet-50 dark:bg-violet-950/20",
    text: "text-violet-600 dark:text-violet-400",
  },
  orange: {
    border: "border-orange-200 dark:border-orange-800/50",
    bg: "bg-orange-50 dark:bg-orange-950/20",
    text: "text-orange-600 dark:text-orange-400",
  },
}

function FieldValue({ value }: { value: unknown }) {
  if (value === undefined || value === null) {
    return <span className="text-xs italic text-muted-foreground">—</span>
  }
  if (typeof value === "boolean") {
    return (
      <Badge variant={value ? "default" : "secondary"} className="text-xs">
        {value ? "Yes" : "No"}
      </Badge>
    )
  }
  return <span className="font-mono text-sm">{String(value)}</span>
}

function SpawnerDetails({
  spawner,
  imageMap,
}: {
  spawner: SpawnerObject
  imageMap?: Map<string, string>
}) {
  const knownKeys = new Set(
    CATEGORIES.flatMap((c) => c.fields.map((f) => f.key as string))
  )
  const extraEntries = Object.entries(spawner).filter(
    ([k]) => !knownKeys.has(k)
  )

  return (
    <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3">
      {CATEGORIES.map((cat) => {
        const relevantFields = cat.fields.filter(
          (f) => spawner[f.key] !== undefined
        )
        if (relevantFields.length === 0) return null
        const colors = COLOR_CLASSES[cat.color]
        return (
          <section
            key={cat.name}
            className={cn("rounded border p-2", colors.border, colors.bg)}
          >
            <h4
              className={cn(
                "mb-1.5 text-[9px] font-bold uppercase tracking-widest",
                colors.text
              )}
            >
              {cat.name}
            </h4>
            <div className="space-y-1">
              {relevantFields.map((f) => (
                <div key={String(f.key)} className="flex items-center justify-between gap-1 text-xs">
                  <span className="shrink-0 text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                    {f.label}
                  </span>
                  {f.key === "m_prefabName" && imageMap ? (
                    <div className="flex min-w-0 flex-wrap items-center justify-end gap-1">
                      <span className="truncate font-mono text-xs">{String(spawner[f.key] ?? "")}</span>
                      {String(spawner[f.key] ?? "")
                        .split(",")
                        .map((p) => p.trim())
                        .filter(Boolean)
                        .map((p) => imageMap.get(p))
                        .filter((url): url is string => !!url)
                        .map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt=""
                            className="h-5 w-5 rounded object-contain"
                          />
                        ))}
                    </div>
                  ) : (
                    <FieldValue value={spawner[f.key]} />
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      })}
      {/* {extraEntries.length > 0 && (
        <section className="rounded border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-900/50">
          <h4 className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Other
          </h4>
          <div className="space-y-1">
            {extraEntries.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-1 text-xs">
                <span className="shrink-0 text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                  {k}
                </span>
                <FieldValue value={v} />
              </div>
            ))}
          </div>
        </section>
      )} */}
    </div>
  )
}

export function SpawnerList({
  spawners,
  onEdit,
  onDelete,
  onAdd,
  imageMap,
}: SpawnerListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSpawners = spawners.filter((spawner) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      spawner.name?.toLowerCase().includes(searchLower) ||
      spawner.m_prefabName?.toLowerCase().includes(searchLower) ||
      spawner.prefabToCopy?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Spawners ({filteredSpawners.length})</CardTitle>
            <CardDescription>
              View and manage spawner definitions
            </CardDescription>
          </div>
          <Button onClick={onAdd} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Spawner
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Search spawners..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        <div className="space-y-2">
          {filteredSpawners.length === 0 ? (
            <p className="text-sm text-muted-foreground">No spawners found</p>
          ) : (
            <RadixAccordion.Root type="multiple" className="space-y-2">
              {filteredSpawners.map((spawner, index) => {
                const actualIndex = spawners.indexOf(spawner)
                return (
                  <RadixAccordion.Item
                    key={spawner.name || index}
                    value={`spawner-${actualIndex}`}
                    className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex items-center">
                      <RadixAccordion.Header className="flex flex-1">
                        <RadixAccordion.Trigger className="group flex flex-1 cursor-pointer items-center gap-3 p-4 text-left outline-none hover:bg-slate-50 dark:hover:bg-slate-900">
                          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          {spawner.m_prefabName && imageMap && (
                            <div className="flex gap-1">
                              {spawner.m_prefabName
                                .split(",")
                                .map((p) => p.trim())
                                .filter(Boolean)
                                .map((p) => imageMap.get(p))
                                .filter((url): url is string => !!url)
                                .map((url, i) => (
                                  <img
                                    key={i}
                                    src={url}
                                    alt=""
                                    className="h-18 w-18 rounded object-contain"
                                  />
                                ))}
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-semibold">{spawner.name}</p>
                            <div className="flex flex-wrap gap-2 pt-1">
                              {spawner.m_prefabName && (
                                <Badge variant="secondary" className="text-xs">
                                  {spawner.m_prefabName}
                                </Badge>
                              )}
                              {spawner.m_maxTotal !== undefined && (
                                <Badge variant="outline" className="text-xs">
                                  Max: {spawner.m_maxTotal}
                                </Badge>
                              )}
                              {spawner.minLevel !== undefined &&
                                spawner.maxLevel !== undefined && (
                                  <Badge variant="outline" className="text-xs">
                                    Lvl {spawner.minLevel}-{spawner.maxLevel}
                                  </Badge>
                                )}
                            </div>
                          </div>
                        </RadixAccordion.Trigger>
                      </RadixAccordion.Header>
                      <div className="flex items-center gap-2 pr-4">
                        <Button
                          variant="outline"
                          size="xl"
                          onClick={() => onEdit(spawner, actualIndex)}
                        >
                          <Edit2 className="text-slate-500" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(actualIndex)}
                        >
                          <Trash2 className="text-red-500" />
                        </Button>
                      </div>
                    </div>

                    <RadixAccordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                      <div className="border-t border-slate-200 dark:border-slate-800">
                        <Tabs defaultValue="details">
                          <div className="px-4 pt-3">
                            <TabsList>
                              <TabsTrigger value="details">Details</TabsTrigger>
                              <TabsTrigger value="code">Code</TabsTrigger>
                            </TabsList>
                          </div>
                          <TabsContent value="details">
                            <SpawnerDetails
                              spawner={spawner}
                              imageMap={imageMap}
                            />
                          </TabsContent>
                          <TabsContent value="code">
                            <div className="p-4">
                              <pre className="overflow-x-auto rounded bg-slate-100 p-3 text-xs dark:bg-slate-800">
                                {JSON.stringify(spawner, null, 2)}
                              </pre>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </RadixAccordion.Content>
                  </RadixAccordion.Item>
                )
              })}
            </RadixAccordion.Root>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
