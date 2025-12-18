import { DescendantLinkageAPI } from '../api/descendant_linkage_api';
import type { DescendantLinkage } from '../models/SupabaseDataModel';

const getAllDescendantLinkages = async (): Promise<DescendantLinkage[]> => {
  try {
    const linkages = await DescendantLinkageAPI.getAllDescendantLinkages();
    return linkages;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getDescendantLinkageById = async (linkageId: string): Promise<DescendantLinkage | null> => {
  try {
    const linkage = await DescendantLinkageAPI.getDescendantLinkageById(linkageId);
    return linkage;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const insertDescendantLinkage = async (linkage: DescendantLinkage): Promise<DescendantLinkage> => {
  try {
    const newLinkage = await DescendantLinkageAPI.createDescendantLinkage(linkage);
    return newLinkage;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateDescendantLinkage = async (linkage: DescendantLinkage): Promise<DescendantLinkage> => {
  try {
    const updatedLinkage = await DescendantLinkageAPI.updateDescendantLinkage(linkage);
    return updatedLinkage;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteDescendantLinkage = async (linkageId: string): Promise<void> => {
  try {
    await DescendantLinkageAPI.deleteDescendantLinkage(linkageId);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getParentsByMemberId = async (memberId: string): Promise<DescendantLinkage> => {
  try {
    const linkageData = await DescendantLinkageAPI.getParentsByMemberId(memberId);
    return linkageData;
  } catch (error) {
    console.log(error);
  }
  return {} as DescendantLinkage;
};

const deleteDescendantLinkageByMemberId = async (memberId: string): Promise<void> => {
  try {
    const parent_child_id = await DescendantLinkageAPI.getParentsByMemberId(memberId).then((data) => data.parent_child_id);
    if (parent_child_id) await DescendantLinkageAPI.deleteDescendantLinkage(parent_child_id);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const DescendantLinkageService = {
  getAllDescendantLinkages,
  getDescendantLinkageById,
  insertDescendantLinkage,
  updateDescendantLinkage,
  deleteDescendantLinkage,
  getParentsByMemberId,
  deleteDescendantLinkageByMemberId,
};
