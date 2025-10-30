import { SpouseAPI } from "../api/spouse_api";
import type { Spouse } from "../models/SupabaseDataModel";

const getAllSpouses = async (): Promise<Spouse[]> => {
    try {
        const spouses = await SpouseAPI.getAllSpouses();
        return spouses;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getSpouseById = async (id: string): Promise<Spouse | null> => {
    try {
        const spouse = await SpouseAPI.getSpouseById(id);
        return spouse;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const insertSpouse = async (spouse: Spouse): Promise<Spouse> => {
    try {
        const newSpouse = await SpouseAPI.createSpouse(spouse);
        return newSpouse;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const updateSpouse = async (spouse: Spouse): Promise<Spouse> => {
    try {
        const updatedSpouse = await SpouseAPI.updateSpouse(spouse);
        return updatedSpouse;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const deleteSpouse = async (id: string): Promise<void> => {
    try {
        await SpouseAPI.deleteSpouse(id);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const SpouseService = {
    getAllSpouses,
    getSpouseById,
    insertSpouse,
    updateSpouse,
    deleteSpouse,
}