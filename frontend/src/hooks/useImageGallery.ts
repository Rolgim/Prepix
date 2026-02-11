import { useState, useEffect } from 'react';

/**
 * @interface Image
 * @description Represents the structure of an image object with its metadata.
 * @property {string} filename - The unique filename of the image.
 * @property {string} source - The source of the image (e.g., where it was obtained).
 * @property {string} copyright - The copyright information for the image.
 */
interface Image {
  filename: string;
  source: string;
  copyright: string;
  datasetRelease: string;
  description: string;
  dataProcessingStages: string;
  coordinates: string;
  isPublic: boolean;
  registrationDate: string;
}

/**
 * @function useImageGallery
 * @description A custom hook to manage the state and logic for an image gallery.
 * It handles fetching images from an API, uploading new images, and managing
 * loading and error states.
 * @returns {object} An object containing the gallery state and functions.
 * @returns {Image[]} .images - An array of image objects currently in the gallery.
 * @returns {boolean} .isLoading - A boolean indicating if an operation (fetch/upload) is in progress.
 * @returns {string | null} .error - An error message string if an error occurred, otherwise null.
 * @returns {(file: File, source: string, copyright: string, datasetRelease: string, description: string, dataProcessingStages: string, coordinates: string, isPublic: boolean) => Promise<boolean>} .uploadImage - An async function to upload a new image.
 * @returns {() => Promise<void>} .refreshImages - A function to manually trigger a refresh of the image list.
 */
export function useImageGallery() {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * @function fetchImages
   * @description Fetches the list of images from the `/api/images` endpoint
   * and updates the component state.
   */
  const fetchImages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/images");
      if (!res.ok) throw new Error("Failed to fetch images");
      const data: Image[] = await res.json();
      setImages(data);
    } catch (err) {
      console.error("Failed to fetch images", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * @function uploadImage
   * @description Uploads a new image file along with its metadata to the `/api/upload` endpoint.
   * On successful upload, it triggers a refresh of the image gallery.
   * @param {File} file - The image file to upload.
   * @param {string} source - The source of the image.
   * @param {string} copyright - The copyright information for the image.
   * @returns {Promise<boolean>} A promise that resolves to `true` on success and `false` on failure.
   */
  const uploadImage = async (file: File, source: string, copyright: string, datasetRelease: string, description: string, dataProcessingStages: string, coordinates: string, isPublic: boolean) => {
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("source", source);
    formData.append("copyright", copyright);
    formData.append("datasetRelease", datasetRelease);
    formData.append("description", description);
    formData.append("dataProcessingStages", dataProcessingStages);
    formData.append("coordinates", coordinates);
    formData.append("isPublic", isPublic.toString());

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      
      // Refresh the gallery to show the new image
      await fetchImages();
      return true;
    } catch (err) {
      console.error("Upload failed", err);
      setError(err instanceof Error ? err.message : "Upload failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // The `useEffect` hook calls `fetchImages` once when the component mounts
  // to populate the gallery initially.
  useEffect(() => {
    fetchImages();
  }, []);

  return {
    images,
    isLoading,
    error,
    uploadImage,
    refreshImages: fetchImages,
  };
}
