import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showSearch: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  showSearch,
}) => {
  if (!showSearch) return null;

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 p-4">
      <label htmlFor="active-search" className="sr-only">
        Search patients
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search
            className="h-6 w-6 text-muted-foreground"
            aria-hidden="true"
          />
        </span>
        <input
          id="active-search"
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search patients by name..."
          className="h-11 w-full rounded-lg bg-accent/20 pl-11 pr-3
             text-foreground placeholder:text-muted-foreground
             focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Search patients"
        />
      </div>
    </div>
  );
};

export default SearchBar;
