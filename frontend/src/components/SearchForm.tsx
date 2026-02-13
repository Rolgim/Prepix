import { useState } from "react";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import { Input } from "./Input";

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export interface SearchFilters {
  source?: string;
  copyright?: string;
  datasetRelease?: string;
  description?: string;
  dataProcessingStages?: string;
  coordinates?: string;
  isPublic?: boolean | null;
}

export function SearchForm({ onSearch, onReset, isLoading }: SearchFormProps) {
  const [source, setSource] = useState("");
  const [copyright, setCopyright] = useState("");
  const [datasetRelease, setDatasetRelease] = useState("");
  const [description, setDescription] = useState("");
  const [dataProcessingStages, setDataProcessingStages] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [publicFilter, setPublicFilter] = useState<string>("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filters: SearchFilters = {
      source: source || undefined,
      copyright: copyright || undefined,
      datasetRelease: datasetRelease || undefined,
      description: description || undefined,
      dataProcessingStages: dataProcessingStages || undefined,
      coordinates: coordinates || undefined,
      isPublic: publicFilter === "all" ? null : publicFilter === "public"
    };
    
    onSearch(filters);
  };

  const handleReset = () => {
    setSource("");
    setCopyright("");
    setDatasetRelease("");
    setDescription("");
    setDataProcessingStages("");
    setCoordinates("");
    setPublicFilter("all");
    onReset();
  };

  return (
    <Card
      className="shadow-lg rounded-2xl border"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)'
      }}
    >
      <CardContent className="p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label 
              htmlFor="search-source" 
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              Source
            </label>
            <Input
              id="search-source"
              placeholder="e.g., M31"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              disabled={isLoading}
              style={{ 
                backgroundColor: 'var(--bg-secondary)', 
                color: 'var(--text-primary)', 
                borderColor: 'var(--border-color)' 
              }}
            />
          </div>

          <div>
            <label 
              htmlFor="search-copyright" 
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              Copyright
            </label>
            <Input
              id="search-copyright"
              placeholder="e.g., © ESA"
              value={copyright}
              onChange={(e) => setCopyright(e.target.value)}
              disabled={isLoading}
              style={{ 
                backgroundColor: 'var(--bg-secondary)', 
                color: 'var(--text-primary)', 
                borderColor: 'var(--border-color)' 
              }}
            />
          </div>

          <div>
            <label 
              htmlFor="search-dataset" 
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              Dataset Release
            </label>
            <Input
              id="search-dataset"
              placeholder="e.g., DR1"
              value={datasetRelease}
              onChange={(e) => setDatasetRelease(e.target.value)}
              disabled={isLoading}
              style={{ 
                backgroundColor: 'var(--bg-secondary)', 
                color: 'var(--text-primary)', 
                borderColor: 'var(--border-color)' 
              }}
            />
          </div>

          <div>
            <label 
              htmlFor="search-description" 
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              Description
            </label>
            <Input
              id="search-description"
              placeholder="Keywords..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              style={{ 
                backgroundColor: 'var(--bg-secondary)', 
                color: 'var(--text-primary)', 
                borderColor: 'var(--border-color)' 
              }}
            />
          </div>

          <div>
            <label 
              htmlFor="search-stages" 
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              Processing Stages
            </label>
            <Input
              id="search-stages"
              placeholder="e.g., VIS/NIR"
              value={dataProcessingStages}
              onChange={(e) => setDataProcessingStages(e.target.value)}
              disabled={isLoading}
              style={{ 
                backgroundColor: 'var(--bg-secondary)', 
                color: 'var(--text-primary)', 
                borderColor: 'var(--border-color)' 
              }}
            />
          </div>

          <div>
            <label 
              htmlFor="search-coordinates" 
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              Coordinates
            </label>
            <Input
              id="search-coordinates"
              placeholder="e.g., tile_001"
              value={coordinates}
              onChange={(e) => setCoordinates(e.target.value)}
              disabled={isLoading}
              style={{ 
                backgroundColor: 'var(--bg-secondary)', 
                color: 'var(--text-primary)', 
                borderColor: 'var(--border-color)' 
              }}
            />
          </div>

          <div>
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Visibility
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="public-filter"
                  value="all"
                  checked={publicFilter === "all"}
                  onChange={(e) => setPublicFilter(e.target.value)}
                  disabled={isLoading}
                />
                <span style={{ color: 'var(--text-primary)' }}>All</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="public-filter"
                  value="public"
                  checked={publicFilter === "public"}
                  onChange={(e) => setPublicFilter(e.target.value)}
                  disabled={isLoading}
                />
                <span style={{ color: 'var(--text-primary)' }}>Public</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="public-filter"
                  value="private"
                  checked={publicFilter === "private"}
                  onChange={(e) => setPublicFilter(e.target.value)}
                  disabled={isLoading}
                />
                <span style={{ color: 'var(--text-primary)' }}>Private</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded 
                bg-gradient-to-r from-blue-300 to-indigo-300
                hover:from-blue-400 hover:to-indigo-400
                disabled:from-gray-300 disabled:to-gray-300
                disabled:cursor-not-allowed
                text-white font-semibold py-2.5 shadow-md
                hover:shadow-lg hover:scale-102
                transition-all duration-200 active:scale-[0.98]"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
            
            <Button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="rounded px-4
                bg-gradient-to-r from-gray-300 to-gray-400
                hover:from-gray-400 hover:to-gray-500
                disabled:from-gray-200 disabled:to-gray-300
                disabled:cursor-not-allowed
                text-white font-semibold py-2.5 shadow-md
                hover:shadow-lg
                transition-all duration-200"
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}