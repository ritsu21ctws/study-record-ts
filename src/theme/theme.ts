import { createSystem, defaultConfig } from '@chakra-ui/react';

const theme = createSystem(defaultConfig, {
  globalCss: {
    'html, body': {
      color: '#333',
      letterSpacing: 'wider',
    },
  },
});

export default theme;
