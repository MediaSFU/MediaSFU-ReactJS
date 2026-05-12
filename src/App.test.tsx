import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the pre-join heading', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /join a room/i })).toBeInTheDocument();
});
