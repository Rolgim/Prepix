import { Sidebar } from "./components/Sidebar";
import { ImageGallery } from "./components/ImageGallery";
import { ToastContainer } from "./components/Toast";
import { useImageGallery } from "./hooks/useImageGallery";
import { useToast } from "./hooks/useToast";

/**
 * @file App.tsx
 * @description The root component of the application.
 * It orchestrates the main layout, including the sidebar and the image gallery,
 * and manages the application's core state by using the `useImageGallery` hook.
 */
export default function App() {
  const { images, isLoading, uploadImage, searchImages, resetSearch } = useImageGallery();
  const { toasts, removeToast, showSuccess, showError } = useToast();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar 
        onUpload={uploadImage}  
        onSearch={searchImages}
        onResetSearch={resetSearch}
        isLoading={isLoading}
        onSuccess={showSuccess}
        onError={showError}
      />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <ImageGallery images={images} isLoading={isLoading} />
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}