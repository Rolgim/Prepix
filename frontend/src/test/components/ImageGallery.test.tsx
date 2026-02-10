// frontend/src/components/ImageGallery.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImageGallery } from '../../components/ImageGallery';

/**
 * @file Test suite for the ImageGallery component.
 * @description This suite tests the different states of the ImageGallery,
 * including its loading state, empty state, and the display of a list of images.
 */
describe('ImageGallery Component', () => {
  const mockImages = [
    { filename: 'img1.png', source: 'NASA', copyright: '© 2026' },
    { filename: 'img2.jpg', source: 'ESA', copyright: '© ESA' }
  ];

  /**
   * @description Verifies that a "Loading..." message is displayed when the `isLoading` prop is true.
   */
  it('renders loading state', () => {
    render(<ImageGallery images={[]} isLoading={true} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  /**
   * @description Verifies that an "empty state" message is shown when there are no images and it is not loading.
   */
  it('renders empty state', () => {
    render(<ImageGallery images={[]} isLoading={false} />);
    expect(screen.getByText(/No images yet/i)).toBeInTheDocument();
  });

  /**
   * @description Checks if the gallery correctly renders a grid of ImageCard components
   * when provided with a list of images.
   */
  it('renders grid of images', () => {
    render(<ImageGallery images={mockImages} />);
    
    // Check for content from both mock images to ensure they are rendered.
    expect(screen.getByText('Source: NASA')).toBeInTheDocument();
    expect(screen.getByText('Source: ESA')).toBeInTheDocument();
  });

  /**
   * @description Ensures that the correct number of image cards are rendered based on the
   * length of the images array.
   */
  it('renders correct number of cards', () => {
    const { container } = render(<ImageGallery images={mockImages} />);
    
    const cards = container.querySelectorAll('img');
    expect(cards.length).toBe(2);
  });
});