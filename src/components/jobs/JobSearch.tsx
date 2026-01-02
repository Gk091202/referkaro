"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input, Select, Button } from "@/components/ui";
import type { JobFilters, LocationType } from "@/lib/types";

interface JobSearchProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  locations: string[];
  companies: string[];
  totalJobs: number;
  filteredCount: number;
}

function JobSearch({
  filters,
  onFiltersChange,
  locations,
  companies,
  totalJobs,
  filteredCount,
}: JobSearchProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (key: keyof JobFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: JobFilters = {
      search: "",
      location: undefined,
      company: "",
      sortBy: "newest",
    };
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters =
    filters.search ||
    filters.location ||
    filters.company ||
    filters.sortBy !== "newest";

  return (
    <div className="space-y-4">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredCount} of {totalJobs} jobs
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search jobs by role, company, or keywords..."
            value={filters.search || ""}
            onChange={(e) => handleChange("search", e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                Clear all
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Location Filter */}
            <Select
              label="Location"
              value={filters.location || "all"}
              onChange={(e) =>
                handleChange(
                  "location",
                  e.target.value === "all" ? "" : e.target.value
                )
              }
              options={[
                { value: "all", label: "All Locations" },
                { value: "remote", label: "Remote" },
                { value: "hybrid", label: "Hybrid" },
                { value: "onsite", label: "On-site" },
              ]}
            />

            {/* Company Filter */}
            <Select
              label="Company"
              value={filters.company || ""}
              onChange={(e) => handleChange("company", e.target.value)}
              options={[
                { value: "", label: "All Companies" },
                ...companies.map((c) => ({ value: c, label: c })),
              ]}
            />

            {/* Sort Filter */}
            <Select
              label="Sort By"
              value={filters.sortBy || "newest"}
              onChange={(e) => handleChange("sortBy", e.target.value)}
              options={[
                { value: "newest", label: "Newest First" },
                { value: "oldest", label: "Oldest First" },
                { value: "company", label: "Company A-Z" },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export { JobSearch };
