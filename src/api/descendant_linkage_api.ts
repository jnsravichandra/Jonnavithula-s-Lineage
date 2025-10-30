
import supabase, { SupabaseTables } from "../context/SupabaseClient";
import type { DescendantLinkage } from "../models/SupabaseDataModel";

const getAllDescendantLinkages = async (): Promise<DescendantLinkage[]> => {
    const { data, error } = await supabase.from(SupabaseTables.DescendantLinkage).select("*");
    if (error) {
        console.log(error);
        throw error;
    }
    return data || [];
}

const getDescendantLinkageById = async (id: string): Promise<DescendantLinkage> => {
    const { data, error } = await supabase.from(SupabaseTables.DescendantLinkage).select("*").eq("parent_child_id", id).single();
    if (error) {
        console.log(error);
        throw error;
    }
    return data || ({} as DescendantLinkage);
}

const createDescendantLinkage = async (linkage: DescendantLinkage): Promise<DescendantLinkage> => {
    const { data, error } = await supabase.from(SupabaseTables.DescendantLinkage).insert(linkage).single();
    if(error) {
        console.log(error);
        throw error;
    }
    return data || ({} as DescendantLinkage);
}

const updateDescendantLinkage = async (linkage: DescendantLinkage): Promise<DescendantLinkage> => {
    const { data, error } = await supabase.from(SupabaseTables.DescendantLinkage).update(linkage).eq("parent_child_id", linkage.parent_child_id).single();
    if(error) {
        console.log(error);
        throw error;
    }
    return data || ({} as DescendantLinkage);
}

const deleteDescendantLinkage = async (id: string): Promise<void> => {
    const { error } = await supabase.from(SupabaseTables.DescendantLinkage).delete().eq("parent_child_id", id);
    if(error) {
        console.log(error);
        throw error;
    }
}

export const DescendantLinkageAPI = {
    getAllDescendantLinkages,
    getDescendantLinkageById,
    createDescendantLinkage,
    updateDescendantLinkage,
    deleteDescendantLinkage,
}