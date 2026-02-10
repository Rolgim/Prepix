import { Sidebar } from "./components/Sidebar";
import { ImageGallery } from "./components/ImageGallery";
import { useImageGallery } from "./hooks/useImageGallery";

/**
 * @file App.tsx
 * @description The root component of the application.
 * It orchestrates the main layout, including the sidebar and the image gallery,
 * and manages the application's core state by using the `useImageGallery` hook.
 */
export default function App() {
  // The useImageGallery hook provides all necessary state and logic for the gallery.
  const { images, isLoading, uploadImage } = useImageGallery();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* The Sidebar contains the upload form and other controls. */}
      <Sidebar onUpload={uploadImage} isLoading={isLoading} />
      
      {/* The main content area displays the image gallery. */}
      <div className="flex-1 p-6 overflow-y-auto">
        <ImageGallery images={images} isLoading={isLoading} />
      </div>
    </div>
  );
}
