import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchForm, SearchFilters } from '../../components/SearchForm';

/**
 * @file Test suite for the SearchForm component.
 * @description This suite verifies that the SearchForm component correctly handles
 * user input, form submission, and reset functionality.
 */
describe('SearchForm Component', () => {
  const mockOnSearch = vi.fn();
  const mockOnReset = vi.fn();

  /**
   * @description Checks if the form calls onSearch with the correct filters on submission.
   */
  it('calls onSearch with the correct filters when the form is submitted', () => {
    render(<SearchForm onSearch={mockOnSearch} onReset={mockOnReset} />);

    // Simulate user input
    fireEvent.change(screen.getByLabelText('Source'), { target: { value: 'M31' } });
    fireEvent.change(screen.getByLabelText('Copyright'), { target: { value: '© ESA' } });
    fireEvent.change(screen.getByLabelText('Dataset Release'), { target: { value: 'DR1' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'galaxy' } });
    fireEvent.change(screen.getByLabelText('Processing Stages'), { target: { value: 'VIS/NIR' } });
    fireEvent.change(screen.getByLabelText('Coordinates'), { target: { value: 'tile_001' } });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    const expectedFilters: SearchFilters = {
      source: 'M31',
      copyright: '© ESA',
      datasetRelease: 'DR1',
      description: 'galaxy',
      dataProcessingStages: 'VIS/NIR',
      coordinates: 'tile_001',
      isPublic: null,
    };

    expect(mockOnSearch).toHaveBeenCalledWith(expectedFilters);
  });

  /**
   * @description Checks if the form is cleared and onReset is called when the reset button is clicked.
   */
  it('clears the form and calls onReset when the reset button is clicked', () => {
    render(<SearchForm onSearch={mockOnSearch} onReset={mockOnReset} />);

    // Simulate user input
    fireEvent.change(screen.getByLabelText('Source'), { target: { value: 'M31' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));

    expect(screen.getByLabelText('Source')).toHaveValue('');
    expect(mockOnReset).toHaveBeenCalled();
  });

  /**
   * @description Checks if the public filter is correctly handled.
   */
  it('handles the public filter correctly', () => {
    render(<SearchForm onSearch={mockOnSearch} onReset={mockOnReset} />);

    // Test "Public" radio button
    fireEvent.click(screen.getByLabelText('Public'));
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(mockOnSearch).toHaveBeenCalledWith(expect.objectContaining({ isPublic: true }));

    // Test "Private" radio button
    fireEvent.click(screen.getByLabelText('Private'));
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(mockOnSearch).toHaveBeenCalledWith(expect.objectContaining({ isPublic: false }));

    // Test "All" radio button
    fireEvent.click(screen.getByLabelText('All'));
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(mockOnSearch).toHaveBeenCalledWith(expect.objectContaining({ isPublic: null }));
  });

  /**
   * @description Checks if the form is disabled when isLoading is true.
   */
  it('disables the form when isLoading is true', () => {
    render(<SearchForm onSearch={mockOnSearch} onReset={mockOnReset} isLoading={true} />);

    expect(screen.getByLabelText('Source')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Searching...' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled();
  });
});
