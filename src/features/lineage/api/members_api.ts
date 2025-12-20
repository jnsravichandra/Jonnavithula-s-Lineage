import type { Member } from "../../../shared/datamodels/SupabaseDataModel";
import supabase from "../../../shared/services/SupabaseClient";

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
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("User is not authenticated");
  }

  const { data, error } = await supabase.from("Member").delete().eq("member_id", id).select();
  if (error) {
    console.log(error);
    throw error;
  }
  if (!data || data.length === 0) {
    throw new Error("Delete failed: Record not found or permission denied.");
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
