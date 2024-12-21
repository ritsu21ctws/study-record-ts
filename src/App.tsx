import { useEffect, useState } from 'react';
import { MdEdit, MdDeleteOutline } from 'react-icons/md';
import { Container, Heading, Table } from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { Record } from '@/domain/record';
import { useMessage } from '@/hooks/useMessage';
import { getAllRecords } from '@/utils/supabaseFunctions';

function App() {
  const [records, setRecords] = useState<Record[]>([]);
  const { showMessage } = useMessage();

  useEffect(() => {
    getAllRecords()
      .then((data) => {
        setRecords(data);
      })
      .catch(() => {
        showMessage({ title: '一覧の取得に失敗しました', type: 'error' });
      });
  }, []);

  return (
    <>
      <Toaster />
      <Heading as="h1" textAlign="left" bg="teal.500" py="4" data-testid="title" color="gray.100">
        <Container>学習記録アプリ</Container>
      </Heading>
      <Container>
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
    </>
  );
}

export default App;
