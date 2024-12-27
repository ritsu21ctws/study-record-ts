import App from '../App';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

describe('App', () => {
  test('タイトルがあること', async () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <App />
      </ChakraProvider>
    );
    const title = screen.getByTestId('title');
    expect(title).toBeInTheDocument();
  });
});
