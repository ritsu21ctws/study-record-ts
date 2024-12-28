import App from '../App';
import { render, screen, waitFor } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import userEvent from '@testing-library/user-event';

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

  test('新規登録ボタンが表示されること', async () => {
    const createButton = screen.getByTestId('create-button');
    expect(createButton).toBeInTheDocument();
  });

  test('タイトルが表示されること', async () => {
    const title = screen.getByTestId('title');
    expect(title).toBeInTheDocument();
  });

  test('学習記録の登録ができること', async () => {
    const beforeLists = await screen.findAllByRole('row');

    await userEvent.click(screen.getByTestId('create-button'));
    await userEvent.type(screen.getByTestId('input-title'), 'テスト記録');
    await userEvent.type(screen.getByTestId('input-time'), '10');
    await userEvent.click(screen.getByTestId('create-submit-button'));

    await waitFor(() => {
      const afterLists = screen.getAllByRole('row');
      expect(afterLists).toHaveLength(beforeLists.length + 1);
    });
  });

  test('新規登録モーダルのタイトルが「新規登録」になっていること', async () => {
    await userEvent.click(screen.getByTestId('create-button'));

    const modalTitle = screen.getByText('新規登録');
    expect(modalTitle).toBeInTheDocument();
  });
});
