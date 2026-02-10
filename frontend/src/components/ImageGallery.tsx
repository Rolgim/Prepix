import { useState } from "react";
import { ImageCard } from "./ImageCard";
import { ExpandedImageView } from "./ExpandedImageView";

/**
 * @interface Image
 * @description Represents the structure of an image object.
 */
interface Image {
  filename: string;
  source: string;
  copyright: string;
}

/**
 * @interface ImageGalleryProps
 * @description Defines the props for the ImageGallery component.
 * @property {Image[]} images - An array of image objects to display.
 * @property {boolean} [isLoading] - An optional boolean to indicate if the gallery is in a loading state.
 */
interface ImageGalleryProps {
  images: Image[];
  isLoading?: boolean;
}

/**
 * @function ImageGallery
 * @description A component that displays a grid of images. It can also show
 * a loading state or an empty state message if no images are available.
 * @param {ImageGalleryProps} props - The props for the component.
 * @returns {JSX.Element} A grid of ImageCard components or a state message.
 */
export function ImageGallery({ images, isLoading }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  // Display a loading message if data is being fetched.
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  // Display a message if there are no images to show.
  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: 'var(--text-secondary)' }}>
          No images yet. Upload your first image!
        </p>
      </div>
    );
  }

  // Render the grid of images using the ImageCard component.
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <ImageCard
            key={image.filename}
            filename={image.filename}
            source={image.source}
            copyright={image.copyright}
            onClick={() => handleImageClick(image)}
          />
        ))}
      </div>
      {selectedImage && (
        <ExpandedImageView
          image={selectedImage}
          onClose={handleClose}
        />
      )}
    </>
  );
}
