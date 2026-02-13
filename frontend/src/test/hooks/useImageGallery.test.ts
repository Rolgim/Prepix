// frontend/src/test/hooks/useImageGallery.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useImageGallery } from '../../hooks/useImageGallery';

/**
 * @file Test suite for the useImageGallery custom hook.
 * @description This suite validates image fetching, uploading, and error handling
 * while ensuring the hook returns the expected structured responses.
 */
describe('useImageGallery Hook', () => {

  /**
   * Reset mocks before each test to ensure isolation.
   * The global fetch function is mocked to allow full control
   * over API responses in each test scenario.
   */
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  /**
   * @description Ensures that images are automatically fetched
   * when the hook is mounted.
   * The hook should populate the images state and disable loading.
   */
  it('fetches images on mount', async () => {
    const mockImages = [
      {
        filename: 'test1.png',
        source: 'Test Source',
        copyright: 'Test Copyright',
        datasetRelease: 'DR1',
        description: 'Test Description',
        dataProcessingStages: 'Test Stages',
        coordinates: 'Test Coordinates',
        isPublic: false,
        uploadDate: '2026-02-11'
      }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockImages,
    });

    const { result } = renderHook(() => useImageGallery());

    // Wait for asynchronous state updates triggered by useEffect
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.images).toEqual(mockImages);
    expect(result.current.isLoading).toBe(false);
  });

  /**
   * @description Validates successful image upload.
   * The hook should:
   * 1. Upload the file.
   * 2. Return a structured success response.
   * 3. Refresh the image list.
   */
  it('uploads image successfully', async () => {
    const mockImage = {
      filename: 'test.png',
      source: 'Test',
      copyright: 'Test',
      datasetRelease: 'DR1',
      description: 'Test',
      dataProcessingStages: 'Test',
      coordinates: 'Test',
      isPublic: false,
      uploadDate: '2026-02-11'
    };

    // Mock initial fetch (empty gallery)
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const { result } = renderHook(() => useImageGallery());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    // Mock upload request + gallery refresh
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockImage,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [mockImage],
      });

    const file = new File(['test'], 'test.png', { type: 'image/png' });

    await act(async () => {
      const resultUpload = await result.current.uploadImage(
        file,
        'Test',
        'Test',
        'DR1',
        'Test Description',
        'Test Stages',
        'Test Coordinates',
        false
      );

      // Validate structured upload response
      expect(resultUpload.success).toBe(true);
      expect(resultUpload.error).toBeNull();
    });

    expect(result.current.images).toHaveLength(1);
  });

  /**
   * @description Ensures the hook properly handles upload failures.
   * The hook should:
   * - Return a failure response object.
   * - Set an error state internally.
   */
  it('handles upload error', async () => {
    // Mock initial fetch
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const { result } = renderHook(() => useImageGallery());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    // Mock failed upload response
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ detail: 'Upload failed' }),
    });

    const file = new File(['test'], 'test.png', { type: 'image/png' });

    await act(async () => {
      const resultUpload = await result.current.uploadImage(
        file,
        'Test',
        'Test',
        'DR Test',
        'Test Description',
        'Test Stages',
        'Test Coordinates',
        false
      );

      expect(resultUpload.success).toBe(false);
      expect(resultUpload.error).toBeTruthy();
    });

    expect(result.current.error).toBeTruthy();
  });

  /**
   * @description Tests behavior when the initial image fetch fails.
   * The hook should capture the error message and keep
   * the images list empty.
   */
  it('handles fetch error', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useImageGallery());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.images).toEqual([]);
  });

});
