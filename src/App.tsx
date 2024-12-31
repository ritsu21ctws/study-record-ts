import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MdEdit, MdDeleteOutline } from 'react-icons/md';
import { FiPlusCircle } from 'react-icons/fi';
import { Box, Center, Container, Flex, Heading, IconButton, Input, Spinner, Stack, Table } from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { NumberInputField, NumberInputRoot } from '@/components/ui/number-input';
import { Toaster } from '@/components/ui/toaster';
import { Record } from '@/domain/record';
import { useMessage } from '@/hooks/useMessage';
import { fetchAllRecords, insertRecord, updateRecord, deleteRecord } from '@/utils/supabaseFunctions';
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog';

function App() {
  const [records, setRecords] = useState<Record[]>([]);
  const [deleteTargetId, setDeleteTargetId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { showMessage } = useMessage();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<Record>({
    defaultValues: {
      title: '',
      time: '0',
    },
  });

  useEffect(() => {
    getAllRecords();
  }, []);

  const onClickOpenModal = (isEditButton: boolean, id?: string) => {
    reset(); // 登録・編集フォームの初期化（発生していたバリデーションメッセージなどをクリア）

    if (isEditButton) {
      const record = records.find((record) => record.id === id);
      if (!record) {
        showMessage({ title: '編集対象のデータが見つかりません', type: 'error' });
        return;
      }
      setValue('id', record.id);
      setValue('title', record.title);
      setValue('time', record.time);
    }

    setIsEditMode(isEditButton);
    setOpen(true);
  };

  const getAllRecords = () => {
    setIsLoading(true);

    fetchAllRecords()
      .then((data) => {
        setRecords(data);
        // 合計時間の計算
        const totalTime = data.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.time), 0);
        setTotalTime(totalTime);
      })
      .catch(() => {
        showMessage({ title: '一覧の取得に失敗しました', type: 'error' });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onSubmit = handleSubmit((data: Record) => {
    setIsCreating(true);

    if (isEditMode) {
      updateRecord(data)
        .then(() => {
          showMessage({ title: '学習記録の更新が完了しました', type: 'success' });
        })
        .catch(() => {
          showMessage({ title: '学習記録の更新に失敗しました', type: 'error' });
        })
        .finally(() => {
          setIsCreating(false);
          reset(); // 編集フォームの初期化
          setOpen(false);
          getAllRecords();
        });
    } else {
      insertRecord(data)
        .then(() => {
          showMessage({ title: '学習記録の登録が完了しました', type: 'success' });
        })
        .catch(() => {
          showMessage({ title: '学習記録の登録に失敗しました', type: 'error' });
        })
        .finally(() => {
          setIsCreating(false);
          reset(); // 登録フォームの初期化
          setOpen(false);
          getAllRecords();
        });
    }
  });

  const onClickDeleteConfirm = (id: string) => {
    setDeleteTargetId(id);
    setOpenConfirm(true);
  };

  const onClickDelete = () => {
    setIsDeleting(true);

    if (typeof deleteTargetId === 'undefined') {
      showMessage({ title: '削除対象のデータが見つかりません', type: 'error' });
      setIsDeleting(false);
      setOpenConfirm(false);
      setDeleteTargetId(undefined);
      return;
    }

    deleteRecord(deleteTargetId)
      .then(() => {
        showMessage({ title: '学習記録の削除が完了しました', type: 'success' });
      })
      .catch(() => {
        showMessage({ title: '学習記録の削除に失敗しました', type: 'error' });
      })
      .finally(() => {
        setIsDeleting(false);
        setOpenConfirm(false);
        setDeleteTargetId(undefined);
        getAllRecords();
      });
  };

  return (
    <>
      <Toaster />

      <Box bg="teal.500" py="4" color="gray.100">
        <Container maxW="6xl">
          <Flex justify="space-between" align="center">
            <Heading as="h1" textAlign="left" data-testid="title">
              学習記録アプリ
            </Heading>
            <IconButton
              aria-label="open create modal"
              variant="ghost"
              size="lg"
              color="white"
              _hover={{ bg: 'teal.500', color: 'gray.200' }}
              onClick={() => onClickOpenModal(false)}
              data-testid="create-button"
            >
              <FiPlusCircle />
            </IconButton>
          </Flex>
        </Container>
      </Box>

      {isLoading ? (
        <Center h="100vh">
          <Spinner data-testid="loading" />
        </Center>
      ) : (
        <Container maxW="6xl">
          <Table.Root size="md" variant="line" my={10} interactive data-testid="study-record-list">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader width="40%">学習内容</Table.ColumnHeader>
                <Table.ColumnHeader width="40%">学習時間</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end"></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {records.map((record) => (
                <Table.Row key={record.id}>
                  <Table.Cell data-testid="record-title">{record.title}</Table.Cell>
                  <Table.Cell data-testid="record-time">{record.time}</Table.Cell>
                  <Table.Cell textAlign="end">
                    <Button colorPalette="blue" variant="outline" mr="4" onClick={() => onClickOpenModal(true, record.id)} data-testid="edit-button">
                      <MdEdit />
                    </Button>
                    <Button colorPalette="red" variant="outline" onClick={() => onClickDeleteConfirm(record.id)}>
                      <MdDeleteOutline />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          <Box data-testid="total-time">合計時間：{totalTime} / 1000 (h)</Box>
        </Container>
      )}

      <DialogRoot lazyMount open={open} onOpenChange={(e) => setOpen(e.open)} motionPreset="slide-in-bottom" trapFocus={false}>
        <DialogContent>
          <DialogCloseTrigger />
          <DialogHeader>
            <DialogTitle>{isEditMode ? '記録編集' : '新規登録'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit}>
            <DialogBody>
              <Stack gap={4}>
                <Field label="学習内容" invalid={!!errors.title} errorText={errors.title?.message}>
                  <Controller
                    name="title"
                    control={control}
                    rules={{
                      required: '内容の入力は必須です',
                    }}
                    render={({ field }) => <Input {...field} data-testid="input-title" />}
                  />
                </Field>
                <Field label="学習時間" invalid={!!errors.time} errorText={errors.time?.message}>
                  <Controller
                    name="time"
                    control={control}
                    rules={{
                      required: '時間の入力は必須です',
                      min: { value: 0, message: '時間は0以上である必要があります' },
                    }}
                    render={({ field }) => (
                      <NumberInputRoot width="100%" name={field.name} value={field.value} onValueChange={({ value }) => field.onChange(value)}>
                        <NumberInputField data-testid="input-time" />
                      </NumberInputRoot>
                    )}
                  />
                </Field>
                <input type="hidden" name="id" />
              </Stack>
            </DialogBody>
            <DialogFooter mb="2">
              <DialogActionTrigger asChild>
                <Button variant="outline" data-testid="create-cancel-button">
                  キャンセル
                </Button>
              </DialogActionTrigger>
              <Button colorPalette="teal" loading={isCreating} type="submit" data-testid="submit-button">
                {isEditMode ? '保存' : '登録'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogRoot>

      <DialogRoot
        role="alertdialog"
        lazyMount
        open={openConfirm}
        onOpenChange={(e) => setOpenConfirm(e.open)}
        motionPreset="slide-in-bottom"
        trapFocus={false}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>削除の確認</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p>削除したデータは戻せません。削除してもよろしいですか？</p>
          </DialogBody>
          <DialogFooter mb="2">
            <DialogActionTrigger asChild>
              <Button variant="outline">キャンセル</Button>
            </DialogActionTrigger>
            <Button colorPalette="red" loading={isDeleting} onClick={onClickDelete} data-testid="delete-submit-button">
              削除
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </>
  );
}

export default App;
