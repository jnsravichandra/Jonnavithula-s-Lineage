import type { Spouse } from "../models/SupabaseDataModel";
import supabase, { SupabaseTables } from "../context/SupabaseClient";

const getAllSpouses = async (): Promise<Spouse[]> => {
    const { data, error } = await supabase.from(SupabaseTables.Spouse).select("*");
    if (error) {
        console.log(error);
        throw error;
    }
    return data || [];
}

const getSpouseById = async (id: string): Promise<Spouse> => {
    const { data, error } = await supabase.from(SupabaseTables.Spouse).select("*").eq("spouse_id", id).single();
    if (error) {
        console.log(error);
        throw error;
    }
    return data || ({} as Spouse);
}

const createSpouse = async (spouse: Spouse): Promise<Spouse> => {
    const { data, error } = await supabase.from(SupabaseTables.Spouse).insert(spouse).single();
    if(error) {
        console.log(error);
        throw error;
    }
    return data || ({} as Spouse);
}

const updateSpouse = async (spouse: Spouse): Promise<Spouse> => {
    const { data, error } = await supabase.from(SupabaseTables.Spouse).update(spouse).eq("spouse_id", spouse.spouse_id).single();
    if(error) {
        console.log(error);
        throw error;
    }
    return data || ({} as Spouse);
}

const deleteSpouse = async (id: string): Promise<void> => {
    const { error } = await supabase.from(SupabaseTables.Spouse).delete().eq("spouse_id", id);
    if(error) {
        console.log(error);
        throw error;
    }
}

export const SpouseAPI = {
    getAllSpouses,
    getSpouseById,
    createSpouse,
    updateSpouse,
    deleteSpouse,
}