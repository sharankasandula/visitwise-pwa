import React from "react";
import { Search } from "lucide-react";

interface MediaFiltersProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filterType: "all" | "image" | "video";
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  filteredCount: number;
  totalCount: number;
}

const MediaFilters: React.FC<MediaFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by filename or patient name..."
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-accent/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <select
          value={filterType}
          onChange={onFilterChange}
          className="px-4 py-2 bg-accent/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="image">Images Only</option>
          <option value="video">Videos Only</option>
        </select>
      </div>

      <div className="text-sm text-muted-foreground">
        {filteredCount} of {totalCount} media items
      </div>
    </div>
  );
};

export default MediaFilters;
