import { supabase } from './supabase';
import { Record } from '@/domain/record';

export const getAllRecords = async (): Promise<Record[]> => {
  const { data, error } = await supabase.from('study-record').select();
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
