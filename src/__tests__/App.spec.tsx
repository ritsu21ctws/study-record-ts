import App from '../App';
import { render, screen } from '@testing-library/react';

describe('App', () => {
  test('タイトルがあること', async () => {
    render(<App />);
    const title = screen.getByTestId('title');
    expect(title).toBeInTheDocument();
  });
});
