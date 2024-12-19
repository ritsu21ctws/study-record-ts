import { Button } from '@/components/ui/button';
import { HStack } from '@chakra-ui/react';

function App() {
  return (
    <>
      <div data-testid="title">タイトル</div>
      <HStack>
        <Button>Click me</Button>
        <Button>Click me</Button>
      </HStack>
    </>
  );
}

export default App;
