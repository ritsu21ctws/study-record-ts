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
import { fetchAllRecords, insertRecord } from '@/utils/supabaseFunctions';
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

function App() {
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const { showMessage } = useMessage();
  const {
    control,
    handleSubmit,
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
        setOpen(false);
        getAllRecords();
      });
  });

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
          <Spinner />
        </Center>
      ) : (
        <Container maxW="6xl">
          <Table.Root size="md" variant="line" my={10}>
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
                    <Button colorPalette="red" variant="outline">
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
        <DialogTrigger />
        <DialogContent>
          <DialogCloseTrigger />
          <DialogHeader>
            <DialogTitle>学習記録登録</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit}>
            <DialogBody mx={4}>
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
    </>
  );
}

export default App;
