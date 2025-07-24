import { supabase } from '../supabase';
import { logError, logInfo } from '@/utils/logger';
import { PGMTDataType } from '@/types/pgmt-types';

export const getPGMT = async (): Promise<PGMTDataType | null> => {
  try {
    const { data, error } = await supabase.rpc('get_pgm_data');

    if (error) throw error;

    return data;

  } catch (error) {
    logError('getPGMT -> fetch error', error);
    return null;
  }
};
