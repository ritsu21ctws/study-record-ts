import App from '../App';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

describe('App', () => {
  beforeEach(() => {
    render(
      <ChakraProvider value={defaultSystem}>
        <App />
      </ChakraProvider>
    );
  });

  test('ローディング画面が表示されること', async () => {
    const loading = screen.getByTestId('loading');
    expect(loading).toBeInTheDocument();
  });

  test('学習記録一覧のテーブルが表示されること', async () => {
    const studyRecordList = await screen.findByTestId('study-record-list');
    expect(studyRecordList).toBeInTheDocument();
  });
});
