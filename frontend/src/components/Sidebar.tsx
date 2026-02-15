import { useState } from "react";
import { DarkModeToggle } from "./DarkModeToggle";
import { UploadForm } from "./UploadForm";
import { SearchForm, SearchFilters } from "./SearchForm";

interface SidebarProps {
  onUpload: (
    file: File,
    source: string,
    copyright: string,
    datasetRelease: string,
    description: string,
    dataProcessingStages: string,
    coordinates: string,
    isPublic: boolean
  ) => Promise<{ success: boolean; error: string | null }>;
  onSearch: (filters: SearchFilters) => void;
  onResetSearch: () => void;
  isLoading?: boolean;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export function Sidebar({ 
  onUpload, 
  onSearch, 
  onResetSearch, 
  isLoading, 
  onSuccess, 
  onError 
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "search">("upload");

  return (
    <div
      className="w-96 p-4 flex flex-col gap-6"
      style={{ backgroundColor: 'var(--bg-tertiary)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl font-bold text-center flex-1"
          style={{ color: 'var(--text-primary)' }}
        >
          Euclid Pretty Pics Portal
        </h1>
        <DarkModeToggle />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <button
          onClick={() => setActiveTab("upload")}
          className={`flex-1 py-2 px-4 font-medium transition-colors ${
            activeTab === "upload" 
              ? "border-b-2 border-blue-500" 
              : "opacity-60 hover:opacity-100"
          }`}
          style={{ 
            color: 'var(--text-primary)',
            borderBottomColor: activeTab === "upload" ? '#3b82f6' : 'transparent'
          }}
        >
          Upload
        </button>
        <button
          onClick={() => setActiveTab("search")}
          className={`flex-1 py-2 px-4 font-medium transition-colors ${
            activeTab === "search" 
              ? "border-b-2 border-blue-500" 
              : "opacity-60 hover:opacity-100"
          }`}
          style={{ 
            color: 'var(--text-primary)',
            borderBottomColor: activeTab === "search" ? '#3b82f6' : 'transparent'
          }}
        >
          Search
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "upload" ? (
          <UploadForm 
            onUpload={onUpload} 
            isLoading={isLoading}
            onSuccess={onSuccess}
            onError={onError}
          />
        ) : (
          <SearchForm 
            onSearch={onSearch}
            onReset={onResetSearch}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Footer Logos */}
      <div className="flex items-center justify-between mt-auto">
        <img 
          src="/Euclid_consortium_logo.png" 
          alt="Euclid Consortium" 
          className="h-14" 
        />  
        <img 
          src="/Euclid_logo.png" 
          alt="Euclid" 
          className="h-16" 
        />
        <img 
          src="/CNES_logo.png" 
          alt="CNES" 
          className="h-16" 
        />
      </div>
    </div>
  );
}