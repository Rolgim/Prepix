import { DarkModeToggle } from "./DarkModeToggle";
import { UploadForm } from "./UploadForm";

interface SidebarProps {
  onUpload: (file: File, source: string, copyright: string, datasetRelease: string, description: string, isPublic: boolean, dataProcessingStages: string, coordinates: string) => Promise<boolean>;
  isLoading?: boolean;
}

export function Sidebar({ onUpload, isLoading }: SidebarProps) {
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

      {/* Upload Form */}
      <UploadForm onUpload={onUpload} isLoading={isLoading} />

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