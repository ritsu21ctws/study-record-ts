import App from '../App';
import { render, screen, waitFor } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import userEvent from '@testing-library/user-event';
import { Record } from '@/domain/record';

const mockFetchAllRecords = jest.fn();
const mockInsertRecord = jest.fn();
const mockUpdateRecord = jest.fn();
const mockDeleteRecord = jest.fn();

jest.mock('@/utils/supabaseFunctions', () => {
  return {
    fetchAllRecords: () => mockFetchAllRecords(),
    insertRecord: () => mockInsertRecord(),
    updateRecord: () => mockUpdateRecord(),
    deleteRecord: () => mockDeleteRecord(),
  };
});

describe('App', () => {
  beforeEach(() => {
    // @ts-ignore
    globalThis.IS_REACT_ACT_ENVIRONMENT = false;

    mockFetchAllRecords.mockResolvedValue([
      new Record('1', 'Sample Record 1', '10'),
      new Record('2', 'Sample Record 2', '20'),
      new Record('3', 'Sample Record 3', '30'),
      new Record('4', 'Sample Record 4', '40'),
    ]);
    mockInsertRecord.mockResolvedValue(Promise.resolve());
    mockUpdateRecord.mockResolvedValue(Promise.resolve());
    mockDeleteRecord.mockResolvedValue(Promise.resolve());

    render(
      <ChakraProvider value={defaultSystem}>
        <App />
      </ChakraProvider>
    );
  });

  test('ローディング画面が表示されること', () => {
    const loading = screen.getByTestId('loading');
    expect(loading).toBeInTheDocument();
  });

  test('学習記録一覧のテーブルが表示されること', async () => {
    const studyRecordList = await screen.findByTestId('study-record-list');
    expect(studyRecordList).toBeInTheDocument();

    const titles = screen.getAllByTestId('record-title');
    const times = screen.getAllByTestId('record-time');
    const totalTime = screen.getByTestId('total-time');

    expect(titles[titles.length - 1]).toHaveTextContent('Sample Record 4');
    expect(times[times.length - 1]).toHaveTextContent('40');
    expect(totalTime).toHaveTextContent('合計時間：100 / 1000 (h)');
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

  test('記録編集モーダルのタイトルが「記録編集」になっていること', async () => {
    const editButtons = await screen.findAllByTestId('edit-button');
    await userEvent.click(editButtons[0]);

    const modalTitle = screen.getByText('記録編集');
    expect(modalTitle).toBeInTheDocument();
  });

  test('学習内容が未入力で登録するとエラーが表示され、登録がされないこと', async () => {
    const beforeLists = await screen.findAllByRole('row');

    await userEvent.click(screen.getByTestId('create-button'));
    await userEvent.click(screen.getByTestId('submit-button'));

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
    await userEvent.click(screen.getByTestId('submit-button'));

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

    await userEvent.click(screen.getByTestId('submit-button'));

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
    mockFetchAllRecords
      .mockResolvedValueOnce([
        new Record('1', 'Sample Record 1', '10'),
        new Record('2', 'Sample Record 2', '20'),
        new Record('3', 'Sample Record 3', '30'),
        new Record('4', 'Sample Record 4', '40'),
      ])
      .mockResolvedValueOnce([
        new Record('1', 'Sample Record 1', '10'),
        new Record('2', 'Sample Record 2', '20'),
        new Record('3', 'Sample Record 3', '30'),
        new Record('4', 'Sample Record 4', '40'),
        new Record('5', 'Sample Record 5', '50'),
      ]);
    mockInsertRecord.mockResolvedValue(Promise.resolve());
    mockUpdateRecord.mockResolvedValue(Promise.resolve());
    mockDeleteRecord.mockResolvedValue(Promise.resolve());

    render(
      <ChakraProvider value={defaultSystem}>
        <App />
      </ChakraProvider>
    );
  });

  test('学習記録の登録ができること', async () => {
    const beforeLists = await screen.findAllByRole('row');

    await userEvent.click(screen.getByTestId('create-button'));
    await userEvent.type(screen.getByTestId('input-title'), 'テスト記録');
    await userEvent.type(screen.getByTestId('input-time'), '10');

    const submitButton = await screen.findByTestId('submit-button');

    await waitFor(() => {
      expect(submitButton).toHaveTextContent('登録');
    });

    await userEvent.click(submitButton);

    await waitFor(
      () => {
        const afterLists = screen.getAllByRole('row');
        expect(afterLists).toHaveLength(beforeLists.length + 1);

        const lastTitle = screen.getAllByTestId('record-title')[afterLists.length - 2];
        const lastTime = screen.getAllByTestId('record-time')[afterLists.length - 2];
        const totalTime = screen.getByTestId('total-time');

        expect(lastTitle).toHaveTextContent('Sample Record 5');
        expect(lastTime).toHaveTextContent('50');
        expect(totalTime).toHaveTextContent('合計時間：150 / 1000 (h)');
        expect(screen.getByText('学習記録の登録が完了しました')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});

describe('データ編集', () => {
  beforeEach(() => {
    mockFetchAllRecords
      .mockResolvedValueOnce([
        new Record('1', 'Sample Record 1', '10'),
        new Record('2', 'Sample Record 2', '20'),
        new Record('3', 'Sample Record 3', '30'),
        new Record('4', 'Sample Record 4', '40'),
      ])
      .mockResolvedValueOnce([
        new Record('1', 'Sample Record 6', '60'),
        new Record('2', 'Sample Record 2', '20'),
        new Record('3', 'Sample Record 3', '30'),
        new Record('4', 'Sample Record 4', '40'),
      ]);
    mockInsertRecord.mockResolvedValue(Promise.resolve());
    mockUpdateRecord.mockResolvedValue(Promise.resolve());
    mockDeleteRecord.mockResolvedValue(Promise.resolve());

    render(
      <ChakraProvider value={defaultSystem}>
        <App />
      </ChakraProvider>
    );
  });

  test('学習記録の編集ができること', async () => {
    const beforeLists = await screen.findAllByRole('row');

    await userEvent.click(screen.getAllByTestId('edit-button')[0]);

    const inputTitle = await screen.findByTestId('input-title');
    const inputTime = await screen.findByTestId('input-time');
    const submitButton = await screen.findByTestId('submit-button');

    await waitFor(() => {
      expect(inputTitle).toHaveValue('Sample Record 1');
      expect(inputTime).toHaveValue('10');
      expect(submitButton).toHaveTextContent('保存');
    });

    await userEvent.type(inputTitle, 'Sample Record 6');
    await userEvent.type(inputTime, '60');
    await userEvent.click(submitButton);

    await waitFor(
      () => {
        const afterLists = screen.getAllByRole('row');
        expect(afterLists).toHaveLength(beforeLists.length);

        const recordTitle = screen.getAllByTestId('record-title')[0];
        const recordTime = screen.getAllByTestId('record-time')[0];
        const totalTime = screen.getByTestId('total-time');

        expect(recordTitle).toHaveTextContent('Sample Record 6');
        expect(recordTime).toHaveTextContent('60');
        expect(totalTime).toHaveTextContent('合計時間：150 / 1000 (h)');
        expect(screen.getByText('学習記録の更新が完了しました')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});

describe('データ削除', () => {
  beforeEach(() => {
    mockFetchAllRecords
      .mockResolvedValueOnce([
        new Record('1', 'Sample Record 1', '10'),
        new Record('2', 'Sample Record 2', '20'),
        new Record('3', 'Sample Record 3', '30'),
        new Record('4', 'Sample Record 4', '40'),
      ])
      .mockResolvedValueOnce([
        new Record('1', 'Sample Record 1', '10'),
        new Record('2', 'Sample Record 2', '20'),
        new Record('3', 'Sample Record 3', '30'),
      ]);
    mockInsertRecord.mockResolvedValue(Promise.resolve());
    mockUpdateRecord.mockResolvedValue(Promise.resolve());
    mockDeleteRecord.mockResolvedValue(Promise.resolve());

    render(
      <ChakraProvider value={defaultSystem}>
        <App />
      </ChakraProvider>
    );
  });

  test('学習記録の削除ができること', async () => {
    const beforeLists = await screen.findAllByRole('row');

    await userEvent.click(screen.getAllByRole('button', { name: '削除' })[beforeLists.length - 2]);
    await userEvent.click(screen.getByTestId('delete-submit-button'));

    await waitFor(
      () => {
        const afterLists = screen.getAllByRole('row');
        expect(afterLists).toHaveLength(beforeLists.length - 1);

        const lastTitle = screen.getAllByTestId('record-title')[afterLists.length - 2];
        const lastTime = screen.getAllByTestId('record-time')[afterLists.length - 2];
        const totalTime = screen.getByTestId('total-time');

        expect(lastTitle).toHaveTextContent('Sample Record 3');
        expect(lastTime).toHaveTextContent('30');
        expect(totalTime).toHaveTextContent('合計時間：60 / 1000 (h)');
        expect(screen.getByText('学習記録の削除が完了しました')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
