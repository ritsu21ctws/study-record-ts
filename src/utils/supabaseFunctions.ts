import { supabase } from './supabase';
import { Record } from '@/domain/record';

export const fetchAllRecords = async (): Promise<Record[]> => {
  const { data, error } = await supabase.from('study-record').select().order('created_at', { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const insertRecord = async (record: Omit<Record, 'id'>): Promise<void> => {
  const { error } = await supabase.from('study-record').insert(record);
  if (error) {
    throw new Error(error.message);
  }
};

export const updateRecord = async (record: Record): Promise<void> => {
  const { id, title, time } = record;
  const { error } = await supabase.from('study-record').update({ title, time }).eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
};

export const deleteRecord = async (id: string): Promise<void> => {
  const { error } = await supabase.from('study-record').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
};
