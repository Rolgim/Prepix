import { Card } from "./Card";
import { motion } from "framer-motion";

/**
 * @interface ImageCardProps
 * @description Defines the props for the ImageCard component.
 * @property {string} filename - The name of the media file (image or video).
 * @property {string} source - The source of the media.
 * @property {string} copyright - The copyright information for the media.
 * @property {() => void} [onClick] - Optional click handler.
 */
interface ImageCardProps {
  filename: string;
  source: string;
  copyright: string;
  onClick?: () => void;
}

/**
 * @function ImageCard
 * @description A component that displays a single image or video with its metadata.
 * It automatically detects whether the file is a video or an image based on its extension
 * and renders the appropriate HTML element.
 * @param {ImageCardProps} props - The props for the component.
 * @returns {JSX.Element} A card element with the media and its details.
 */
export function ImageCard({ filename, source, copyright, onClick }: ImageCardProps) {
  // Simple regex to detect common video file extensions.
  const isVideo = filename.match(/\.(mp4|webm|ogg|mov)$/i);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card
        className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)'
        }}
      >
        {/* Conditionally render a <video> or <img> tag. */}
        {isVideo ? (
          <video
            src={`/uploads/${filename}`}
            controls
            className="w-full h-48 object-cover"
          />
        ) : (
          <img
            src={`/uploads/${filename}`}
            alt={filename}
            className="w-full h-48 object-cover"
          />
        )}

        <div className="p-4">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Source: {source}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Copyright: {copyright}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}