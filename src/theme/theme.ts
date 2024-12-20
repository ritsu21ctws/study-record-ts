import { createSystem, defaultConfig } from '@chakra-ui/react';

const theme = createSystem(defaultConfig, {
  globalCss: {
    'html, body': {
      backgroundColor: 'gray.100',
      color: 'gray.100',
      letterSpacing: 'wider',
    },
  },
});

export default theme;
