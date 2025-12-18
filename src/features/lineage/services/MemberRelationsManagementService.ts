import type { DescendantLinkage, Member, Spouse } from '../../../shared/datamodels/SupabaseDataModel';
import { DescendantLinkageService } from './DescendantLinkageService';
import { MemberService } from './MemberService';
import { SpouseService } from './SpouseService';

const AddSiblingMember = async (newMember: Member, contextMember: Member) => {
  const insertedNewmember = await MemberService.insertMember(newMember);
  const contextMemberParents: DescendantLinkage = await DescendantLinkageService.getParentsByMemberId(contextMember.member_id!);
  if (contextMemberParents?.parent_a_id !== null && contextMemberParents?.parent_b_id !== null) {
    if (contextMemberParents?.parent_a_id !== undefined && contextMemberParents?.parent_b_id !== undefined) {
      const newDescendantEntry: DescendantLinkage = {
        child_id: insertedNewmember.member_id!,
        parent_a_id: contextMemberParents?.parent_a_id,
        parent_b_id: contextMemberParents?.parent_b_id,
        created_at: new Date(),
        relationship_type: '',
        date_established: insertedNewmember.birth_date ? new Date(insertedNewmember.birth_date) : new Date(),
        date_terminated: null,
        notes: '',
        parent_child_id: '',
      };
      delete newDescendantEntry.parent_child_id;
      await DescendantLinkageService.insertDescendantLinkage(newDescendantEntry);
    }
  }
};

const AddChildMember = async (newMember: Member, contextMember: Member) => {
  const insertedNewmember = await MemberService.insertMember(newMember);
  let contextSpouse: Spouse | null = null;
  if (contextMember.gender === 'Male') {
    contextSpouse = await SpouseService.getSpouseForMaleMember(contextMember.member_id!);
  } else {
    contextSpouse = await SpouseService.getSpouseForFemaleMember(contextMember.member_id!);
  }
  if (contextSpouse) {
    const newDescendantEntry: DescendantLinkage = {
      child_id: insertedNewmember.member_id!,
      parent_a_id: contextSpouse.member_a_id,
      parent_b_id: contextSpouse.member_b_id,
      created_at: new Date(),
      relationship_type: '',
      date_established: insertedNewmember.birth_date ? new Date(insertedNewmember.birth_date) : new Date(),
      date_terminated: null,
      notes: '',
      parent_child_id: '',
    };
    delete newDescendantEntry.parent_child_id;
    await DescendantLinkageService.insertDescendantLinkage(newDescendantEntry);
  }
};

const AddSpouseMember = async (newMember: Member, contextMember: Member) => {
  const insertedNewmember = await MemberService.insertMember(newMember);
  const father = insertedNewmember.gender === 'Male' ? insertedNewmember : contextMember;
  const mother = insertedNewmember.gender === 'Female' ? insertedNewmember : contextMember;
  const newSpouseEntry: Spouse = {
    created_at: new Date(),
    member_a_id: father.member_id!,
    member_b_id: mother.member_id!,
    relationship_status: '',
    start_date: new Date(),
    end_date: null,
    location: '',
    notes: '',
    spouse_id: '',
  };
  delete newSpouseEntry.spouse_id;
  await SpouseService.insertSpouse(newSpouseEntry);
};

export const MemberRelationsManagementService = {
  AddSiblingMember,
  AddChildMember,
  AddSpouseMember,
};
