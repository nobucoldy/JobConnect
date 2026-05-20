import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./services/jobService', () => ({
  jobService: {
    getAllJobs: () => Promise.resolve({ data: { data: [] } }),
  },
}));

test('renders the home page', async () => {
  const { container } = render(<App />);

  expect(container.querySelector('.home-page')).toBeInTheDocument();
  expect(await screen.findByRole('link', { name: /xem/i })).toBeInTheDocument();
});
