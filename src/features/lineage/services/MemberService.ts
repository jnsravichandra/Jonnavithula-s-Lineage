import type { Member } from "../../../shared/datamodels";
import { MemberAPI } from "../api/members_api";


const getAllMembers = async (): Promise<Member[]> => {
  try {
    const members = await MemberAPI.getAllMembers();
    return members;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getMemberById = async (id: string): Promise<Member> => {
  try {
    const member = await MemberAPI.getMemberById(id);
    return member;
  } catch (error) {
    console.log(error);
    return {} as Member;
  }
};

const insertMember = async (member: Member): Promise<Member> => {
  try {
    const newMember = await MemberAPI.createMember(member);
    return newMember;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateMember = async (member: Member): Promise<Member> => {
  try {
    const updatedMember = await MemberAPI.updateMember(member);
    return updatedMember;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteMember = async (id: string): Promise<void> => {
  try {
    console.log('Deleting member:', id);
    const deleteMember = await MemberAPI.deleteMember(id);
    return deleteMember;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getMemberByBirthDate = async (birth_date: Date) => {
  try {
    const member = await MemberAPI.getMemberByBirthDate(birth_date);
    return member;
  } catch (error) {
    console.log(error);
    return {} as Member;
  }
};

export const MemberService = {
  getAllMembers,
  getMemberById,
  insertMember,
  updateMember,
  deleteMember,
  getMemberByBirthDate,
};
