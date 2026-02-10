// frontend/src/components/UploadForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UploadForm } from '../../components/UploadForm';

/**
 * @file Test suite for the UploadForm component.
 * @description This suite covers all aspects of the form's functionality,
 * including initial rendering, field validation, user interaction, and submission.
 */
describe('UploadForm Component', () => {
  /**
   * @description Verifies that all essential form fields (file input, text inputs, and submit button)
   * are present in the document when the component is rendered.
   */
  it('renders all form fields', () => {
    const mockOnUpload = vi.fn();
    render(<UploadForm onUpload={mockOnUpload} />);

    expect(screen.getByLabelText(/file/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Source')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Copyright')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
  });

  /**
   * @description Ensures the submit button is disabled by default, preventing submission
   * when no file has been selected.
   */
  it('disables submit button when no file selected', () => {
    const mockOnUpload = vi.fn();
    render(<UploadForm onUpload={mockOnUpload} />);

    const submitButton = screen.getByRole('button', { name: /upload/i });
    expect(submitButton).toBeDisabled();
  });

  /**
   * @description Checks that the submit button becomes enabled once a user has selected a file.
   */
  it('enables submit button when file is selected', async () => {
    const mockOnUpload = vi.fn();
    render(<UploadForm onUpload={mockOnUpload} />);
    const user = userEvent.setup();

    const fileInput = screen.getByLabelText(/file/i) as HTMLInputElement;
    const file = new File(['content'], 'test.png', { type: 'image/png' });
    
    await user.upload(fileInput, file);

    const submitButton = screen.getByRole('button', { name: /upload/i });
    expect(submitButton).not.toBeDisabled();
  });

  /**
   * @description Simulates a user filling out and submitting the form, then verifies that
   * the `onUpload` callback is triggered with the correct data.
   */
  it('calls onUpload with correct data', async () => {
    const mockOnUpload = vi.fn().mockResolvedValue(true);
    render(<UploadForm onUpload={mockOnUpload} />);
    const user = userEvent.setup();

    // Simulate user filling the form.
    const fileInput = screen.getByLabelText(/file/i) as HTMLInputElement;
    const sourceInput = screen.getByPlaceholderText('Source');
    const copyrightInput = screen.getByPlaceholderText('Copyright');

    const file = new File(['content'], 'test.png', { type: 'image/png' });
    await user.upload(fileInput, file);
    await user.type(sourceInput, 'Test Source');
    await user.type(copyrightInput, 'Test Copyright');

    // Simulate form submission.
    const submitButton = screen.getByRole('button', { name: /upload/i });
    await user.click(submitButton);

    expect(mockOnUpload).toHaveBeenCalledWith(file, 'Test Source', 'Test Copyright');
  });

  /**
   * @description Verifies that the form fields are cleared after a successful upload,
   * preparing the form for the next submission.
   */
  it('clears form after successful upload', async () => {
    // The mock must resolve to true for the form to clear.
    const mockOnUpload = vi.fn().mockResolvedValue(true);
    render(<UploadForm onUpload={mockOnUpload} />);
    const user = userEvent.setup();

    // Fill and submit the form.
    const fileInput = screen.getByLabelText(/file/i) as HTMLInputElement;
    const sourceInput = screen.getByPlaceholderText('Source') as HTMLInputElement;
    const copyrightInput = screen.getByPlaceholderText('Copyright') as HTMLInputElement;

    const file = new File(['content'], 'test.png', { type: 'image/png' });
    await user.upload(fileInput, file);
    await user.type(sourceInput, 'Test Source');
    await user.type(copyrightInput, 'Test Copyright');

    const submitButton = screen.getByRole('button', { name: /upload/i });
    await user.click(submitButton);

    // Assert that the text inputs are empty after submission.
    expect(sourceInput.value).toBe('');
    expect(copyrightInput.value).toBe('');
  });

  /**
   * @description Checks that the form displays a loading indicator and disables the submit button
   * when the `isLoading` prop is true.
   */
  it('shows loading state during upload', () => {
    const mockOnUpload = vi.fn();
    render(<UploadForm onUpload={mockOnUpload} isLoading={true} />);

    expect(screen.getByText('Uploading...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /uploading/i })).toBeDisabled();
  });
});
