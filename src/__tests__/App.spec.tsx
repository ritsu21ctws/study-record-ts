import App from '../App';
import { render, screen, waitFor } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import userEvent from '@testing-library/user-event';
import { Record } from '@/domain/record';

describe('App', () => {
  beforeEach(() => {
    render(
      <ChakraProvider value={defaultSystem}>
        <App />
      </ChakraProvider>
    );
  });

  const mockFetchAllRecords = jest
    .fn()
    .mockResolvedValue([
      new Record('1', 'Sample Record 1', '2024-12-30T12:00:00Z'),
      new Record('2', 'Sample Record 2', '2024-12-30T14:30:00Z'),
      new Record('3', 'Sample Record 3', '2024-12-30T16:45:00Z'),
      new Record('4', 'Sample Record 4', '2024-12-31T08:00:00Z'),
    ]);

  const mockInsertRecord = jest.fn(() => Promise.resolve());

  const mockDeleteRecord = jest.fn(() => Promise.resolve());

  jest.mock('@/utils/supabaseFunctions', () => {
    return {
      fetchAllRecords: () => mockFetchAllRecords(),
      insertRecord: () => mockInsertRecord(),
      deleteRecord: () => mockDeleteRecord(),
    };
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

  test('新規登録モーダルのタイトルが「新規登録」になっていること', async () => {
    await userEvent.click(screen.getByTestId('create-button'));

    const modalTitle = screen.getByText('新規登録');
    expect(modalTitle).toBeInTheDocument();
  });

  test('学習内容が未入力で登録するとエラーが表示され、登録がされないこと', async () => {
    const beforeLists = await screen.findAllByRole('row');

    await userEvent.click(screen.getByTestId('create-button'));
    await userEvent.click(screen.getByTestId('create-submit-button'));

    await waitFor(() => {
      const errorMessage = screen.getByText('内容の入力は必須です');
      expect(errorMessage).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('create-cancel-button'));

    await waitFor(() => {
      const afterLists = screen.getAllByRole('row');
      expect(afterLists).toHaveLength(beforeLists.length);
    });
  });

  test('学習時間が未入力で登録するとエラーが表示され、登録がされないこと', async () => {
    const beforeLists = await screen.findAllByRole('row');

    await userEvent.click(screen.getByTestId('create-button'));
    await userEvent.type(screen.getByTestId('input-title'), 'テスト記録');
    await userEvent.clear(screen.getByTestId('input-time'));
    await userEvent.click(screen.getByTestId('create-submit-button'));

    await waitFor(() => {
      const errorMessage = screen.getByText('時間の入力は必須です');
      expect(errorMessage).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('create-cancel-button'));

    await waitFor(() => {
      const afterLists = screen.getAllByRole('row');
      expect(afterLists).toHaveLength(beforeLists.length);
    });
  });

  test('学習時間が0未満で登録するとエラーが表示され、登録がされないこと', async () => {
    const beforeLists = await screen.findAllByRole('row');

    await userEvent.click(screen.getByTestId('create-button'));

    await userEvent.type(screen.getByTestId('input-title'), 'テスト記録');
    const timeInput = screen.getByTestId('input-time');
    await userEvent.clear(timeInput);
    await userEvent.type(timeInput, '-1');

    await userEvent.click(screen.getByTestId('create-submit-button'));

    await waitFor(() => {
      const errorMessage = screen.getByText('時間は0以上である必要があります');
      expect(errorMessage).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('create-cancel-button'));

    await waitFor(() => {
      const afterLists = screen.getAllByRole('row');
      expect(afterLists).toHaveLength(beforeLists.length);
    });
  });
});

describe('データ登録', () => {
  beforeEach(() => {
    render(
      <ChakraProvider value={defaultSystem}>
        <App />
      </ChakraProvider>
    );
  });

  const mockFetchAllRecords = jest
    .fn()
    .mockResolvedValueOnce([
      new Record('1', 'Sample Record 1', '2024-12-30T12:00:00Z'),
      new Record('2', 'Sample Record 2', '2024-12-30T14:30:00Z'),
      new Record('3', 'Sample Record 3', '2024-12-30T16:45:00Z'),
      new Record('4', 'Sample Record 4', '2024-12-31T08:00:00Z'),
    ])
    .mockResolvedValueOnce([
      new Record('1', 'Sample Record 1', '2024-12-30T12:00:00Z'),
      new Record('2', 'Sample Record 2', '2024-12-30T14:30:00Z'),
      new Record('3', 'Sample Record 3', '2024-12-30T16:45:00Z'),
      new Record('4', 'Sample Record 4', '2024-12-31T08:00:00Z'),
      new Record('5', 'Sample Record 5', '2024-12-31T10:15:00Z'),
    ]);

  const mockInsertRecord = jest.fn(() => Promise.resolve());

  const mockDeleteRecord = jest.fn(() => Promise.resolve());

  jest.mock('@/utils/supabaseFunctions', () => {
    return {
      fetchAllRecords: () => mockFetchAllRecords(),
      insertRecord: () => mockInsertRecord(),
      deleteRecord: () => mockDeleteRecord(),
    };
  });

  test('学習記録の登録ができること', async () => {
    const beforeLists = await screen.findAllByRole('row');

    await userEvent.click(screen.getByTestId('create-button'));
    await userEvent.type(screen.getByTestId('input-title'), 'テスト記録');
    await userEvent.type(screen.getByTestId('input-time'), '10');
    await userEvent.click(screen.getByTestId('create-submit-button'));

    await waitFor(
      () => {
        const afterLists = screen.getAllByRole('row');
        expect(afterLists).toHaveLength(beforeLists.length + 1);
      },
      { timeout: 2000 }
    );
  });
});

describe('データ削除', () => {
  beforeEach(() => {
    render(
      <ChakraProvider value={defaultSystem}>
        <App />
      </ChakraProvider>
    );
  });

  const mockFetchAllRecords = jest
    .fn()
    .mockResolvedValueOnce([
      new Record('1', 'Sample Record 1', '2024-12-30T12:00:00Z'),
      new Record('2', 'Sample Record 2', '2024-12-30T14:30:00Z'),
      new Record('3', 'Sample Record 3', '2024-12-30T16:45:00Z'),
      new Record('4', 'Sample Record 4', '2024-12-31T08:00:00Z'),
      new Record('5', 'Sample Record 5', '2024-12-31T10:15:00Z'),
    ])
    .mockResolvedValueOnce([
      new Record('1', 'Sample Record 1', '2024-12-30T12:00:00Z'),
      new Record('2', 'Sample Record 2', '2024-12-30T14:30:00Z'),
      new Record('3', 'Sample Record 3', '2024-12-30T16:45:00Z'),
      new Record('4', 'Sample Record 4', '2024-12-31T08:00:00Z'),
    ]);

  const mockInsertRecord = jest.fn(() => Promise.resolve());

  const mockDeleteRecord = jest.fn(() => Promise.resolve());

  jest.mock('@/utils/supabaseFunctions', () => {
    return {
      fetchAllRecords: () => mockFetchAllRecords(),
      insertRecord: () => mockInsertRecord(),
      deleteRecord: () => mockDeleteRecord(),
    };
  });

  test('学習記録の削除ができること', async () => {
    const beforeLists = await screen.findAllByRole('row');

    await userEvent.click(screen.getAllByRole('button', { name: '削除' })[beforeLists.length - 2]);
    await userEvent.click(screen.getByTestId('delete-submit-button'));

    await waitFor(
      () => {
        const afterLists = screen.getAllByRole('row');
        expect(afterLists).toHaveLength(beforeLists.length - 1);
      },
      { timeout: 2000 }
    );
  });
});
