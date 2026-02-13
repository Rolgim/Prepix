// frontend/src/App.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

/**
 * @file Integration test suite for the main App component.
 * @description These tests verify that the major components of the application
 * are rendered and integrated correctly. It covers initial rendering, data fetching,
 * and the full user flow of uploading an image.
 */
describe('App Component - Integration Tests', () => {
  // Before each test, mock the global fetch to ensure predictable behavior.
  // By default, it simulates a successful fetch that returns an empty list of images.
  beforeEach(() => {
    vi.clearAllMocks();
    
    global.fetch = vi.fn((url) => {
      if (url === '/api/images') {
        return Promise.resolve({
          ok: true,
          json: async () => []
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    }) as any;
  });

  /**
   * @description Checks if the main application title is rendered correctly.
   */
  it('renders the app title', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Euclid Pretty Pics Portal')).toBeInTheDocument();
    });
  });

  /**
   * @description Verifies that the App component attempts to fetch images when it mounts.
   */
  it('fetches images on mount', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/images');
    });
  });

  /**
   * @description Ensures that the UploadForm component is rendered within the App.
   */
  it('displays upload form', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Source')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Copyright')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Dataset Release')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Data Processing Stages')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Coordinates')).toBeInTheDocument();
      expect(screen.getByLabelText(/public data/i)).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: /upload/i })[1]).toBeInTheDocument(); /* 0 is the button in the header, 1 is the one in the form */
    });
  });

  /**
   * @description Tests if images fetched from the API are correctly displayed in the gallery.
   */
  it('displays fetched images', async () => {
    const mockImages = [
      {
        filename: 'test1.png',
        source: 'Gaia',
        copyright: '© ESA 2026',
        datasetRelease: "DR3",
        description: "Test Description 1",
        dataProcessingStages: "Test Stages 1",
        coordinates: "Test Coordinates 1",
        public: true
      }
    ];

    // Override the default fetch mock to return a specific list of images.
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockImages
      })
    ) as any;

    render(<App />);

    // The test waits for the image card content to appear in the document.
    await waitFor(() => {
      expect(screen.getByText('Source: Gaia')).toBeInTheDocument();
    });
  });

  /**
   * @description Simulates a full user flow: filling out the upload form, submitting,
   * and verifying that the gallery is refreshed with the new image data.
   */
  it('uploads and refreshes gallery', async () => {
    let imagesList = [];

    // Mock fetch to handle both upload and the subsequent gallery refresh.
    global.fetch = vi.fn((url) => {
      if (url === '/api/upload') {
        // After a successful upload, the "database" is updated.
        imagesList = [{
          filename: 'new.png', 
          source: 'Test Source', 
          copyright: 'Test Copyright',
          datasetRelease: 'DR Test',
          description: 'Test Description',
          dataProcessingStages: 'Test Stages',
          coordinates: 'Test Coordinates',
          public: true}
        ];
        return Promise.resolve({ ok: true, json: async () => ({ success: true }) });
      }
      // The next fetch to /api/images will return the updated list.
      return Promise.resolve({ ok: true, json: async () => imagesList });
    }) as any;

    render(<App />);
    const user = userEvent.setup();

    // Simulate user filling the form.
    const sourceInput = screen.getByPlaceholderText('Source');
    const copyrightInput = screen.getByPlaceholderText('Copyright');
    await user.type(sourceInput, 'Test Source');
    await user.type(copyrightInput, 'Test Copyright');
    await user.type(screen.getByPlaceholderText('Dataset Release'), 'DR Test');
    await user.type(screen.getByPlaceholderText('Description'), 'Test Description');
    await user.type(screen.getByPlaceholderText('Data Processing Stages'), 'Test Stages');
    await user.type(screen.getByPlaceholderText('Coordinates'), 'Test Coordinates');
    await user.click(screen.getByLabelText(/public data/i));

    // Simulate file selection.
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['content'], 'test.png', { type: 'image/png' });
    await user.upload(fileInput, file);

    // Simulate form submission.
    const submitButton = screen.getAllByRole('button', { name: /upload/i })[1];
    await user.click(submitButton);

    // Wait for the gallery to be updated with the new image's data.
    await waitFor(() => {
      expect(screen.getByText('Source: Test Source')).toBeInTheDocument();
    });
  });
});
