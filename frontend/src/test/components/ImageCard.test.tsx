// frontend/src/components/ImageCard.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImageCard } from '../../components/ImageCard';

/**
 * @file Test suite for the ImageCard component.
 * @description This suite verifies that the ImageCard component correctly renders
 * different media types (image or video) based on the file extension and displays
 * the associated metadata.
 */
describe('ImageCard Component', () => {
  /**
   * @description Checks if the component renders an `<img>` tag for standard image file types
   * and displays the source and copyright information.
   */
  it('renders image for image files', () => {
    render(
      <ImageCard 
        filename="test.png" 
        source="NASA" 
        copyright="© 2026"
      />
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/uploads/test.png');
    expect(screen.getByText('Source: NASA')).toBeInTheDocument();
    expect(screen.getByText('Copyright: © 2026')).toBeInTheDocument();
  });

  /**
   * @description Checks if the component renders a `<video>` tag for video file types
   * and includes the necessary controls.
   */
  it('renders video for video files', () => {
    render(
      <ImageCard 
        filename="video.mp4" 
        source="ESA" 
        copyright="© ESA" 
      />
    );

    const video = document.querySelector('video');
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute('src', '/uploads/video.mp4');
    expect(video).toHaveAttribute('controls');
  });

  /**
   * @description Verifies that the component can correctly detect and render a video element
   * for a range of common video file extensions.
   */
  it('detects various video formats', () => {
    const videoFormats = ['test.mp4', 'test.webm', 'test.ogg', 'test.mov'];

    videoFormats.forEach(filename => {
      const { container, unmount } = render(
        <ImageCard filename={filename} source="Test" copyright="Test" />
      );
      
      expect(container.querySelector('video')).toBeInTheDocument();
      // Clean up the DOM for the next iteration.
      unmount();
    });
  });
});
