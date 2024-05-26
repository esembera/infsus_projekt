import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import Page from '../app/page.jsx'

// Mock the Loader component to avoid implementation details
vi.mock('../app/components/loader', () => ({
  __esModule: true,
  default: () => '<div data-testid="loader">Loading...</div>',
}));

// Mock the ImageFeed component to avoid implementation details
vi.mock('../app/components/imageFeed', () => ({
  __esModule: true,
  default: ({ images }) => (
    '<div>' +
    images.map((image) => (
      '<img key="' + image.id + '" src="/' + image.photoName + '" alt="' + image.photoName + '" />'
    )).join('') +
    '</div>'
  ),
}));

describe('Page Component', () => {
  beforeEach(() => {
    // Mock the fetch API
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, photoName: 'Sunset', photoType: 'landscape' },
          { id: 2, photoName: 'Portrait', photoType: 'portrait' },
        ]),
      })
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<Page />);
    expect(screen.getByText(/feed/i)).toBeInTheDocument();
  });

  test('displays loader initially', async () => {
    render(<Page />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  test('fetches and displays images', async () => {
    render(<Page />);
    await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  test('filters images based on search query', async () => {
    render(<Page />);
    await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());
    const input = screen.getByPlaceholderText(/search images/i);
    fireEvent.change(input, { target: { value: 'Sunset' } });
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveAttribute('alt', 'Sunset');
  });

  test('filters images based on selected type', async () => {
    render(<Page />);
    await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());
    const selectTrigger = screen.getByText(/filter by type/i);
    fireEvent.click(selectTrigger);
    const selectItem = screen.getByText(/portrait/i);
    fireEvent.click(selectItem);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveAttribute('alt', 'Portrait');
  });

  test('displays all images when "All Types" is selected', async () => {
    render(<Page />);
    await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());
    const selectTrigger = screen.getByText(/filter by type/i);
    fireEvent.click(selectTrigger);
    const selectItem = screen.getByText(/all types/i);
    fireEvent.click(selectItem);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });
});
