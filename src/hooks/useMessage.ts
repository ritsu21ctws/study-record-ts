import { useCallback } from 'react';
import { toaster } from '@/components/ui/toaster';

type Props = {
  title: string;
  type: 'info' | 'warning' | 'success' | 'error';
};

export const useMessage = () => {
  const showMessage = useCallback((prpps: Props) => {
    const { title, type } = prpps;
    toaster.create({
      title,
      type,
      duration: 3000,
      meta: { closable: true },
    });
  }, []);
  return { showMessage };
};
