import { MemberAPI } from "../api/members_api";
import type { Member } from "../models/SupabaseDataModel";

const getAllMembers = async (): Promise<Member[]> => {
    try {
        const members = await MemberAPI.getAllMembers();
        return members;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getMemberById = async (id: string): Promise<Member | null> => {
    try {
        const member = await MemberAPI.getMemberById(id);
        return member;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const insertMember = async (member: Member): Promise<Member> => {
    try {
        const newMember = await MemberAPI.createMember(member);
        return newMember;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const updateMember = async (member: Member): Promise<Member> => {
    try {
        const updatedMember = await MemberAPI.updateMember(member);
        return updatedMember;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const deleteMember = async (id: string): Promise<void> => {
    try {
        await MemberAPI.deleteMember(id);
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export const MemberService = {
    getAllMembers,
    getMemberById,
    insertMember,
    updateMember,
    deleteMember,
}