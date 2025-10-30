import { DescendantLinkageAPI } from "../api/descendant_linkage_api";
import type { DescendantLinkage } from "../models/SupabaseDataModel";

const getAllDescendantLinkages = async (): Promise<DescendantLinkage[]> => {
    try {
        const linkages = await DescendantLinkageAPI.getAllDescendantLinkages();
        return linkages;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getDescendantLinkageById = async (id: string): Promise<DescendantLinkage | null> => {
    try {
        const linkage = await DescendantLinkageAPI.getDescendantLinkageById(id);
        return linkage;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const insertDescendantLinkage = async (linkage: DescendantLinkage): Promise<DescendantLinkage> => {
    try {
        const newLinkage = await DescendantLinkageAPI.createDescendantLinkage(linkage);
        return newLinkage;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const updateDescendantLinkage = async (linkage: DescendantLinkage): Promise<DescendantLinkage> => {
    try {
        const updatedLinkage = await DescendantLinkageAPI.updateDescendantLinkage(linkage);
        return updatedLinkage;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const deleteDescendantLinkage = async (id: string): Promise<void> => {
    try {
        await DescendantLinkageAPI.deleteDescendantLinkage(id);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const DescendantLinkageService = {
    getAllDescendantLinkages,
    getDescendantLinkageById,
    insertDescendantLinkage,
    updateDescendantLinkage,
    deleteDescendantLinkage,
}