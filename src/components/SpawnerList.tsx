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
import { ChevronDown, Plus, Trash2, Edit2 } from "lucide-react"
import type { SpawnerObject } from "@/types/spawner"

interface SpawnerListProps {
  spawners: SpawnerObject[]
  onEdit: (spawner: SpawnerObject, index: number) => void
  onDelete: (index: number) => void
  onAdd: () => void
  imageMap?: Map<string, string>
}

export function SpawnerList({
  spawners,
  onEdit,
  onDelete,
  onAdd,
  imageMap,
}: SpawnerListProps) {
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedIndices)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedIndices(newExpanded)
  }

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
            filteredSpawners.map((spawner, index) => {
              const actualIndex = spawners.indexOf(spawner)
              const isExpanded = expandedIndices.has(actualIndex)

              return (
                <div
                  key={spawner.name || index}
                  className="rounded-lg border border-slate-200 dark:border-slate-800"
                >
                  <div
                    className="flex cursor-pointer items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-900"
                    onClick={() => toggleExpanded(actualIndex)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
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
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{spawner.name}</p>
                          </div>
                          <div className="flex gap-2 pt-1">
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
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Button
                        variant="outline"
                        size={"xl"}
                        className="text-xl"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(spawner, actualIndex)
                        }}
                      >
                        <Edit2 className="text-slate-500" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size={"sm"}
                        className="text-xl"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(actualIndex)
                        }}
                      >
                        <Trash2 className="text-red-500" />
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                      <pre className="overflow-x-auto rounded bg-slate-100 p-3 text-xs dark:bg-slate-800">
                        {JSON.stringify(spawner, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
