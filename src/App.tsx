import { useEffect, useState } from 'react';
import { MdEdit, MdDeleteOutline } from 'react-icons/md';
import { FiPlusCircle } from 'react-icons/fi';
import { Box, Center, Container, Flex, Heading, IconButton, Input, Spinner, Stack, Table } from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { NumberInputField, NumberInputRoot } from '@/components/ui/number-input';
import { Toaster } from '@/components/ui/toaster';
import { Record } from '@/domain/record';
import { useMessage } from '@/hooks/useMessage';
import { getAllRecords } from '@/utils/supabaseFunctions';
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
  const [open, setOpen] = useState(false);
  const { showMessage } = useMessage();

  useEffect(() => {
    setIsLoading(true);
    getAllRecords()
      .then((data) => {
        setRecords(data);
      })
      .catch(() => {
        showMessage({ title: '一覧の取得に失敗しました', type: 'error' });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const onClickRegist = () => {
    setOpen(true);
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
              onClick={onClickRegist}
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
          <DialogBody mx={4}>
            <Stack gap={4}>
              <Field label="学習内容" required>
                <Input />
              </Field>
              <Field label="学習内容" required>
                <NumberInputRoot min={0} width="100%">
                  <NumberInputField />
                </NumberInputRoot>
              </Field>
            </Stack>
          </DialogBody>
          <DialogFooter mb="2">
            <DialogActionTrigger asChild>
              <Button variant="outline">キャンセル</Button>
            </DialogActionTrigger>
            <Button bg="teal.500">登録</Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
}

export default App;
