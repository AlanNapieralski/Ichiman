"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Search } from "lucide-react"
import { RANK_FILTER_OPTIONS, SORT_OPTIONS } from "@/lib/skill-filters-config"

type SkillFiltersProps = {
  searchTerm: string
  onSearchTermChange: (value: string) => void
  rankFilter: string
  onRankFilterChange: (value: string) => void
  sortBy: string
  onSortByChange: (value: string) => void
}

export default function SkillFilters({
  searchTerm,
  onSearchTermChange,
  rankFilter,
  onRankFilterChange,
  sortBy,
  onSortByChange,
}: SkillFiltersProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={rankFilter} onValueChange={onRankFilterChange}>
            <SelectTrigger className="w-full md:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by rank" />
            </SelectTrigger>
            <SelectContent>
              {RANK_FILTER_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}


