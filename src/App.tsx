import { Button } from '@/components/ui/button';
import { Heading, HStack } from '@chakra-ui/react';

function App() {
  return (
    <>
      <Heading as="h1" textAlign="left" bg="teal.500" p={4} data-testid="title">
        学習記録アプリ
      </Heading>
      <HStack>
        <Button>Click me</Button>
        <Button>Click me</Button>
      </HStack>
    </>
  );
}

export default App;
