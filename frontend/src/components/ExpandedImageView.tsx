import { motion } from "framer-motion";

/**
 * @interface Image
 * @description Represents the structure of an image object.
 */
interface Image {
  filename: string;
  source: string;
  copyright: string;
  dataset_release: string;
  description: string;
  data_processing_stages: string;
  coordinates: string;
  registration_date: string;
  public: boolean;
}

/**
 * @interface ExpandedImageViewProps
 * @description Defines the props for the ExpandedImageView component.
 * @property {Image} image - The image to display.
 * @property {() => void} onClose - The function to call when the view is closed.
 */
interface ExpandedImageViewProps {
  image: Image;
  onClose: () => void;
}

/**
 * @function ExpandedImageView
 * @description A component that displays a single image in an expanded view, overlaying the gallery.
 * @param {ExpandedImageViewProps} props - The props for the component.
 * @returns {JSX.Element} An expanded view of the image.
 */
export function ExpandedImageView({ image, onClose }: ExpandedImageViewProps) {
  const isVideo = image.filename.match(/\.(mp4|webm|ogg|mov)$/i);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
        {isVideo ? (
          <video
            src={`/uploads/${image.filename}`}
            controls
            autoPlay
            className="w-full h-auto"
            style={{ maxHeight: '80vh' }}
          />
        ) : (
          <img
            src={`/uploads/${image.filename}`}
            alt={image.filename}
            className="w-full h-auto"
            style={{ maxHeight: '80vh' }}
          />
        )}
        <div className="text-white mt-2 text-center">
          <p>Source: {image.source}</p>
          <p>Copyright: {image.copyright}</p>
          <p>Dataset Release: {image.dataset_release}</p>
          <p>Description: {image.description}</p>
          <p>Data Processing Stages: {image.data_processing_stages}</p>
          <p>Coordinates: {image.coordinates}</p>
          <p>Registration Date: {image.registration_date}</p>
          <p>Public image: {image.public ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </motion.div>
  );
}
