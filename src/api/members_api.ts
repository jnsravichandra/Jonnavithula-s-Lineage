import type { Member } from "../models/SupabaseDataModel";
import supabase from "../context/SupabaseClient";

const getAllMembers = async (): Promise<Member[]> => {
  const { data, error } = await supabase.from("Member").select("*").order("birth_date", { ascending: true });
  if (error) {
    console.log(error);
    throw error;
  }
  return data || [];
};

const getMemberById = async (id: string): Promise<Member> => {
  const { data, error } = await supabase.from("Member").select("*").eq("member_id", id).single();
  if (error) {
    console.log(error);
    throw error;
  }
  return data || {};
};

const createMember = async (member: Member): Promise<Member> => {
  const { data, error } = await supabase.from("Member").insert(member).single();
  if (error) {
    console.log(error);
    throw error;
  }
  return data || ({} as Member);
};

const updateMember = async (member: Member): Promise<Member> => {
  const { data, error } = await supabase.from("Member").update(member).eq("member_id", member.member_id).single();
  if (error) {
    console.log(error);
    throw error;
  }
  return data || ({} as Member);
};

const deleteMember = async (id: string): Promise<void> => {
  const { error } = await supabase.from("Member").delete().eq("member_id", id);
  if (error) {
    console.log(error);
    throw error;
  }
};

const getMemberByBirthDate = async (birth_date: Date | null): Promise<Member | null> => {
  let query = supabase.from("Member").select("*");

  if (birth_date) {
    query = query.gt("birth_date", birth_date.toISOString());
  }

  const { data, error } = await query.order("birth_date", { ascending: true }).limit(1).single();

  if (error) {
    console.log(error);
    return null;
  }
  return data;
};

export const MemberAPI = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  getMemberByBirthDate,
};
