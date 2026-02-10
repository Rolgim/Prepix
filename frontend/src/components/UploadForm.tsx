import { useState } from "react";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import { Input } from "./Input";

/**
 * @interface UploadFormProps
 * @description Defines the props for the UploadForm component.
 * @property {(file: File, source: string, copyright: string) => Promise<boolean>} onUpload - A callback function that is triggered on form submission. It should handle the file upload logic and return a promise that resolves to a boolean indicating success.
 * @property {boolean} [isLoading] - An optional boolean to indicate if an upload is currently in progress.
 */
interface UploadFormProps {
  onUpload: (file: File, source: string, copyright: string) => Promise<boolean>;
  isLoading?: boolean;
}

/**
 * @function UploadForm
 * @description A form component that allows users to select a file and enter metadata (source, copyright)
 * for uploading. It manages its own internal state for the form fields.
 * @param {UploadFormProps} props - The props for the component.
 * @returns {JSX.Element} A form wrapped in a card.
 */
export function UploadForm({ onUpload, isLoading }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState("");
  const [copyright, setCopyright] = useState("");

  /**
   * @function handleSubmit
   * @description Handles the form's submit event. It calls the `onUpload` prop
   * with the form data and, on success, clears the form fields.
   * @param {React.FormEvent} e - The form event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const success = await onUpload(file, source, copyright);
    
    // If the upload was successful, reset the form to its initial state.
    if (success) {
      setFile(null);
      setSource("");
      setCopyright("");
      // A simple way to clear the file input's displayed value.
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
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
            className="block text-sm font-medium"
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
            className="block text-sm font-medium"
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
            className="block text-sm font-medium"
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
