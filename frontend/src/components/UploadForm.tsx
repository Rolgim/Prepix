import { useState } from "react";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import { Input } from "./Input";

/**
 * @interface UploadFormProps
 * @description Defines the props for the UploadForm component.
 * @property {(file: File, source: string, copyright: string, datasetRelease: string, description: string, dataProcessingStages: string, coordinates: string, isPublic: boolean) => Promise<boolean>} onUpload - A callback function that is triggered on form submission. It should handle the file upload logic and return a promise that resolves to a boolean indicating success.
 * @property {boolean} [isLoading] - An optional boolean to indicate if an upload is currently in progress.
 */
interface UploadFormProps {
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
  isLoading?: boolean;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

/**
 * @function UploadForm
 * @description A form component that allows users to select a file and enter metadata (source, copyright)
 * for uploading. It manages its own internal state for the form fields.
 * @param {UploadFormProps} props - The props for the component.
 * @returns {JSX.Element} A form wrapped in a card.
 */
export function UploadForm({ onUpload, isLoading, onSuccess, onError }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState("");
  const [copyright, setCopyright] = useState("");
  const [datasetRelease, setDatasetRelease] = useState("");
  const [description, setDescription] = useState("");
  const [dataProcessingStages, setDataProcessingStages] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [isPublic, setIsPublic] = useState(false);


  /**
   * @function handleSubmit
   * @description Handles the form's submit event. It calls the `onUpload` prop
   * with the form data and, on success, clears the form fields.
   * @param {React.FormEvent} e - The form event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      onError?.("Please select a file");
      return;
    }

    const result = await onUpload(
      file, 
      source, 
      copyright, 
      datasetRelease, 
      description, 
      dataProcessingStages, 
      coordinates, 
      isPublic
    );
    
    // If the upload was successful, reset the form to its initial state.
    if (result.success) {
      setFile(null);
      setSource("");
      setCopyright("");
      setDatasetRelease("");
      setDescription("");
      setDataProcessingStages("");
      setCoordinates("");
      setIsPublic(false);
      
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      onSuccess?.("Image uploaded successfully");
    } else {
      onError?.(result.error || "Upload failed");
    }
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <label 
            htmlFor="file-input" 
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            File
          </label>
          <Input
            id="file-input"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            disabled={isLoading}
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              color: 'var(--text-primary)', 
              borderColor: 'var(--border-color)' 
            }}
          />

          <label 
            htmlFor="source-input" 
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Source
          </label>
          <Input
            id="source-input"
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            disabled={isLoading}
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              color: 'var(--text-primary)', 
              borderColor: 'var(--border-color)' 
            }}
          />

          <label 
            htmlFor="copyright-input" 
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Copyright
          </label>
          <Input
            id="copyright-input"
            placeholder="Copyright"
            value={copyright}
            onChange={(e) => setCopyright(e.target.value)}
            disabled={isLoading}
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              color: 'var(--text-primary)', 
              borderColor: 'var(--border-color)' 
            }}
          />

          <label 
            htmlFor="dataset-release-input" 
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Dataset Release
          </label>
          <Input
            id="dataset-release-input"
            placeholder="Dataset Release"
            value={datasetRelease}
            onChange={(e) => setDatasetRelease(e.target.value)}
            disabled={isLoading}
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              color: 'var(--text-primary)', 
              borderColor: 'var(--border-color)' 
            }}
          />

          <label 
            htmlFor="description-input" 
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Description
          </label>
          <Input
            id="description-input"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              color: 'var(--text-primary)', 
              borderColor: 'var(--border-color)' 
            }}
          />

          <label 
            htmlFor="data-processing-stages-input" 
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Data Processing Stages
          </label>
          <Input
            id="data-processing-stages-input"
            placeholder="Data Processing Stages"
            value={dataProcessingStages}
            onChange={(e) => setDataProcessingStages(e.target.value)}
            disabled={isLoading}
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              color: 'var(--text-primary)', 
              borderColor: 'var(--border-color)' 
            }}
          />

          <label 
            htmlFor="coordinates-input" 
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Coordinates
          </label>
          <Input
            id="coordinates-input"
            placeholder="Coordinates"
            value={coordinates}
            onChange={(e) => setCoordinates(e.target.value)}
            disabled={isLoading}
            style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              color: 'var(--text-primary)', 
              borderColor: 'var(--border-color)' 
            }}
          />
          <div className="flex items-center justify-between">
            <label 
              htmlFor="public-private-checkbox" 
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              Public data
            </label>
            <input
              id="public-private-checkbox"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
          </div>

          <Button
            type="submit"
            disabled={!file || isLoading}
            className="w-full rounded 
              bg-gradient-to-r from-blue-300 to-indigo-300
              hover:from-blue-400 hover:to-indigo-400
              disabled:from-gray-300 disabled:to-gray-300
              disabled:cursor-not-allowed
              text-white font-semibold py-2.5 shadow-md
              hover:shadow-lg hover:scale-102
              transition-all duration-200 active:scale-[0.98]"
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
