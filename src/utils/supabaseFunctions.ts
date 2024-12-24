import { supabase } from './supabase';
import { Record } from '@/domain/record';

export const fetchAllRecords = async (): Promise<Record[]> => {
  const { data, error } = await supabase.from('study-record').select();
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const insertRecord = async (record: Record): Promise<void> => {
  const { error } = await supabase.from('study-record').insert(record);
  if (error) {
    throw new Error(error.message);
  }
};
