// frontend/src/App.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    vi.clearAllMocks();
    
    // Default successful response for /images
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

  it('renders the app title', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Euclid Pretty Pics Portal')).toBeInTheDocument();
    });
  });

  it('fetches images on mount', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/images');
    });
  });

  it('displays upload form', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Source')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Copyright')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
    });
  });

  it('displays fetched images', async () => {
    const mockImages = [
      {
        filename: 'test1.png',
        source: 'Gaia',
        copyright: '© ESA 2026'
      },
      {
        filename: 'test2.jpg',
        source: 'Euclid',
        copyright: '© ESA 2026'
      }
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockImages
      })
    ) as any;

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Source: Gaia')).toBeInTheDocument();
      expect(screen.getByText('Source: Euclid')).toBeInTheDocument();
    });
  });

  it('handles fetch error gracefully', async () => {
    global.fetch = vi.fn(() =>
      Promise.reject(new Error('Network error'))
    ) as any;

    // Should not crash
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Euclid Pretty Pics Portal')).toBeInTheDocument();
    });
  });

  it('renders video elements for video files', async () => {
    const mockImages = [
      {
        filename: 'video.mp4',
        source: 'Test',
        copyright: 'Test',
      },
    ];
  
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockImages,
      })
    ) as any;
  
    render(<App />);
  
    await waitFor(() => {
      const videos = Array.from(document.querySelectorAll('video'));
      expect(videos.length).toBeGreaterThan(0);
  
      const video = videos.find((v) => v.src.includes('video.mp4'));
      expect(video).toBeTruthy();
    });
  });
  

  it('renders image elements for image files', async () => {
    const mockImages = [
      {
        filename: 'photo.png',
        source: 'Test',
        copyright: 'Test'
      }
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockImages
      })
    ) as any;

    render(<App />);

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });
  });

  it('allows file selection', async () => {
    render(<App />);
    const user = userEvent.setup();

    const fileInput = screen.getByLabelText(/file/i) || 
                     document.querySelector('input[type="file"]');
    
    expect(fileInput).toBeTruthy();

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    
    if (fileInput) {
      await user.upload(fileInput, file);
      expect(fileInput.files?.[0]).toBe(file);
    }
  });

  it('submits form with data', async () => {
    global.fetch = vi.fn((url) => {
      if (url === '/api/upload') {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true })
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => []
      });
    }) as any;

    render(<App />);
    const user = userEvent.setup();

    // Fill form
    const sourceInput = screen.getByPlaceholderText('Source');
    const copyrightInput = screen.getByPlaceholderText('Copyright');
    
    await user.type(sourceInput, 'Test Source');
    await user.type(copyrightInput, 'Test Copyright');

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['content'], 'test.png', { type: 'image/png' });
    await user.upload(fileInput, file);

    // Submit
    const submitButton = screen.getByRole('button', { name: /upload/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/upload',
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });
});
