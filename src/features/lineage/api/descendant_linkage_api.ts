import supabase, { SupabaseTables } from '../../../shared/services/SupabaseClient';
import type { DescendantLinkage, ErrorType } from '../../../shared/datamodels/SupabaseDataModel';

const getAllDescendantLinkages = async (): Promise<DescendantLinkage[]> => {
  const { data, error } = await supabase.from(SupabaseTables.DescendantLinkage).select('*');
  if (error) {
    console.log(error);
    throw error;
  }
  return data || [];
};

const getDescendantLinkageById = async (id: string): Promise<DescendantLinkage> => {
  const { data, error } = await supabase.from(SupabaseTables.DescendantLinkage).select('*').eq('parent_child_id', id).maybeSingle();
  if (error) {
    console.log(error);
    throw error;
  }
  return data || ({} as DescendantLinkage);
};

const createDescendantLinkage = async (linkage: DescendantLinkage): Promise<DescendantLinkage> => {
  const { data, error } = await supabase.from(SupabaseTables.DescendantLinkage).insert(linkage);
  if (error) {
    console.log(error);
    const errorResult: ErrorType = {message: error.message, code: error.code};
    return {error: errorResult} as DescendantLinkage;
  }
  return data || ({} as DescendantLinkage);
};

const updateDescendantLinkage = async (linkage: DescendantLinkage): Promise<DescendantLinkage> => {
  const { data, error } = await supabase.from(SupabaseTables.DescendantLinkage).update(linkage).eq('parent_child_id', linkage.parent_child_id).maybeSingle();
  if (error) {
    console.log(error);
    throw error;
  }
  return data || ({} as DescendantLinkage);
};

const deleteDescendantLinkage = async (id: string): Promise<void> => {
  const { error } = await supabase.from(SupabaseTables.DescendantLinkage).delete().eq('parent_child_id', id);
  if (error) {
    console.log(error);
    throw error;
  }
};

const getParentsByMemberId = async (memberId: string): Promise<DescendantLinkage> => {
  const { data, error } = await supabase.from(SupabaseTables.DescendantLinkage).select('*').eq('child_id', memberId).limit(1).maybeSingle();

  if (error) {
    console.log(error);
    return {} as DescendantLinkage;
  }
  return data || ({} as DescendantLinkage);
};

export const DescendantLinkageAPI = {
  getAllDescendantLinkages,
  getDescendantLinkageById,
  createDescendantLinkage,
  updateDescendantLinkage,
  deleteDescendantLinkage,
  getParentsByMemberId,
};
