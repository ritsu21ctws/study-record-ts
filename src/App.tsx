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
import { fetchAllRecords, insertRecord, deleteRecord } from '@/utils/supabaseFunctions';
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
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const { showMessage } = useMessage();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Record>({
    defaultValues: {
      title: '',
      time: '0',
    },
  });

  useEffect(() => {
    getAllRecords();
  }, []);

  const onClickOpenModal = () => {
    setOpen(true);
  };

  const getAllRecords = () => {
    setIsLoading(true);
    fetchAllRecords()
      .then((data) => {
        setRecords(data);
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

      <Box bg="teal.500" py="4" data-testid="title" color="gray.100">
        <Container maxW="6xl">
          <Flex justify="space-between" align="center">
            <Heading as="h1" textAlign="left">
              学習記録アプリ
            </Heading>
            <IconButton
              aria-label="Search database"
              variant="ghost"
              size="lg"
              color="white"
              _hover={{ bg: 'teal.500', color: 'gray.200' }}
              onClick={onClickOpenModal}
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
          <Table.Root size="md" variant="line" my={10} interactive>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>タイトル</Table.ColumnHeader>
                <Table.ColumnHeader>時間</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end"></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {records.map((record) => (
                <Table.Row key={record.id}>
                  <Table.Cell>{record.title}</Table.Cell>
                  <Table.Cell>{record.time}</Table.Cell>
                  <Table.Cell textAlign="end">
                    <Button colorPalette="blue" variant="outline" mr="4">
                      <MdEdit />
                      編集
                    </Button>
                    <Button colorPalette="red" variant="outline" onClick={() => onClickDeleteConfirm(record.id)}>
                      <MdDeleteOutline />
                      削除
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Container>
      )}

      <DialogRoot lazyMount open={open} onOpenChange={(e) => setOpen(e.open)} motionPreset="slide-in-bottom" trapFocus={false}>
        <DialogContent>
          <DialogCloseTrigger />
          <DialogHeader>
            <DialogTitle>学習記録登録</DialogTitle>
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
                    render={({ field }) => <Input {...field} />}
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
                        <NumberInputField />
                      </NumberInputRoot>
                    )}
                  />
                </Field>
              </Stack>
            </DialogBody>
            <DialogFooter mb="2">
              <DialogActionTrigger asChild>
                <Button variant="outline">キャンセル</Button>
              </DialogActionTrigger>
              <Button colorPalette="teal" loading={isCreating} type="submit">
                登録
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
            <Button colorPalette="red" loading={isDeleting} onClick={onClickDelete}>
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
