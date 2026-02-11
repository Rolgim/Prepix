// frontend/src/test/hooks/useImageGallery.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useImageGallery } from '../../hooks/useImageGallery';

/**
 * @file Test suite for the useImageGallery custom hook.
 * @description This suite verifies all core functionalities of the hook, including
 * fetching images, uploading new images, and handling various error states.
 */
describe('useImageGallery Hook', () => {
  // Before each test, clear all mocks to ensure a clean, isolated state.
  // A global fetch mock is set up to return an empty array by default,
  // simulating a successful but empty API response.
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => [],
      })
    ) as any;
  });

  /**
   * @description Verifies that the hook automatically fetches images when it is first mounted.
   * It should initially be in a loading state and then transition to a loaded state
   * with the fetched images.
   */
  it('fetches images on mount', async () => {
    const mockImages = [{ filename: 'test.png', source: 'NASA', copyright: '© 2026' }];
    // Override the global fetch mock for this specific test case.
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockImages
      })
    ) as any;

    const { result } = renderHook(() => useImageGallery());

    // After mounting, the hook should update its state to reflect the fetched data.
    // `waitFor` is used to handle the asynchronous nature of the fetch operation.
    await waitFor(() => {
      expect(result.current.images).toEqual(mockImages);
      expect(result.current.isLoading).toBe(false);
    });
  });

  /**
   * @description Tests the successful image upload functionality.
   * After an upload, the hook should automatically refresh the image list to include the new image.
   */
  it('uploads image successfully', async () => {
    const { result } = renderHook(() => useImageGallery());
    // Wait for the initial fetch (from on-mount effect) to complete before proceeding.
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Mock the fetch calls for both the upload POST and the subsequent GET for image list refresh.
    global.fetch = vi.fn((url) => {
      if (url === '/api/upload') {
        return Promise.resolve({ ok: true });
      }
      if (url === '/api/images') {
        return Promise.resolve({
          ok: true,
          json: async () => [{ filename: 'uploaded.png', source: 'Test', copyright: 'Test', datasetRelease: "DR Test", description: "Test Description", dataProcessingStages: "Test Stages", coordinates: "Test Coordinates", isPublic: true }]
        });
      }
      return Promise.resolve({ ok: true, json: async () => [] });
    }) as any;

    const file = new File(['content'], 'test.png', { type: 'image/png' });
    
    // Perform the upload action within an `act` block to correctly handle asynchronous state updates in React.
    await act(async () => {
      await result.current.uploadImage(file, 'Test', 'Test', 'DR Test', 'Test Description', 'Test Registration Date', 'Test Stages', 'Test Coordinates', true);
    });

    // `waitFor` asserts that the image list is eventually updated with the new image.
    await waitFor(() => {
      expect(result.current.images).toHaveLength(1);
      expect(result.current.images[0].filename).toBe('uploaded.png');
      expect(result.current.isLoading).toBe(false);      
    });
  });

  /**
   * @description Verifies that the hook correctly handles a failed upload attempt.
   * The error state should be set with an appropriate message, and the loading state should be reset.
   */
  it('handles upload error', async () => {
    // Mock a failed (non-ok) response from the upload endpoint.
    global.fetch = vi.fn((url) => {
      if (url === '/api/upload') {
        return Promise.resolve({ ok: false });
      }
      return Promise.resolve({ ok: true, json: async () => [] });
    }) as any;

    const { result } = renderHook(() => useImageGallery());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const file = new File(['content'], 'test.png', { type: 'image/png' });
    
    // Perform the upload action and assert that it returns `false` to indicate failure.
    await act(async () => {
      const success = await result.current.uploadImage(file, 'Test', 'Test', 'DR Test', 'Test Description', 'Test Registration Date', 'Test Stages', 'Test Coordinates', true);
      expect(success).toBe(false);
    });

    // The hook's state should be updated to reflect the error.
    await waitFor(() => {
      expect(result.current.error).toBe('Upload failed');
      expect(result.current.isLoading).toBe(false);
    });
  });

  /**
   * @description Checks how the hook behaves when the initial image fetch fails (e.g., a network error).
   * The error state should be set, and the loading state should be reset.
   */
  it('handles fetch error', async () => {
    // Mock a rejected promise for the fetch call to simulate a network or server error.
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

    const { result } = renderHook(() => useImageGallery());

    // `waitFor` is used to wait for the hook to handle the rejected promise and update its state.
    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
      expect(result.current.isLoading).toBe(false);
    });
  });
});
