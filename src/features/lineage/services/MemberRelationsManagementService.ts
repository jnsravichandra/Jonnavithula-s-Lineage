import type { DescendantLinkage, Member, Spouse } from '../../../shared/datamodels/SupabaseDataModel';
import { DescendantLinkageService } from './DescendantLinkageService';
import { MemberService } from './MemberService';
import { SpouseService } from './SpouseService';

const AddSiblingMember = async (newMember: Member, contextMember: Member) => {
  const insertedNewMember = await MemberService.insertMember(newMember);

  // console.log('inserted newMember: ', insertedNewMember);

  const contextMemberParents = await DescendantLinkageService.getParentsByMemberId(contextMember.member_id!);

  // console.log('context Member Parents', contextMemberParents);

  if (contextMemberParents?.parent_a_id && contextMemberParents?.parent_b_id) {
    const newDescendantEntry: DescendantLinkage = {
      child_id: insertedNewMember.member_id!,
      parent_a_id: contextMemberParents?.parent_a_id,
      parent_b_id: contextMemberParents?.parent_b_id,
      created_at: new Date(),
      relationship_type: '',
      date_established: insertedNewMember.birth_date ? new Date(insertedNewMember.birth_date) : new Date(),
      date_terminated: null,
      notes: '',
      parent_child_id: '',
    };
    delete newDescendantEntry.parent_child_id;
    // console.log('new descendant entry: ', newDescendantEntry);
    await DescendantLinkageService.insertDescendantLinkage(newDescendantEntry);
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

  if (!insertedNewmember?.member_id) {
    console.error('Error: insertedNewmember is missing member_id. Cannot link spouse.');
    return;
  }

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AddRelationship_Parent = async (sourceMember: Member, targetMember: Member, payload: any) => {
  const spouseEntry: Spouse =
    sourceMember.gender === 'Male'
      ? await SpouseService.getSpouseForMaleMember(sourceMember.member_id!)
      : await SpouseService.getSpouseForFemaleMember(sourceMember.member_id!);

  const father: Member = await MemberService.getMemberById(spouseEntry.member_a_id);

  const mother: Member = await MemberService.getMemberById(spouseEntry.member_b_id);

  const child: Member = targetMember;

  const newDescendantEntry: DescendantLinkage = {
    child_id: child.member_id!,
    parent_a_id: father.member_id!,
    parent_b_id: mother.member_id!,
    created_at: new Date(),
    relationship_type: payload.relationType,
    date_established: sourceMember.birth_date ? sourceMember.birth_date : new Date(),
    date_terminated: null,
    notes: payload.notes ? payload.notes : '',
    parent_child_id: '',
  };
  delete newDescendantEntry.parent_child_id;

  const result = await DescendantLinkageService.insertDescendantLinkage(newDescendantEntry);
  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AddRelationship_Spouse = async (sourceMember: Member, targetMember: Member, payload: any) => {
  const husband: Member = targetMember.gender === 'Male' ? targetMember : sourceMember;
  const wife: Member = targetMember.gender === 'Female' ? targetMember : sourceMember;

  const newSpouseEntry: Spouse = {
    created_at: new Date(),
    member_a_id: husband.member_id!,
    member_b_id: wife.member_id!,
    relationship_status: payload.relationshipStatus,
    start_date: new Date(),
    end_date: payload.endDate ? new Date(payload.endDate) : null,
    location: payload.location ? payload.location : '',
    notes: payload.notes ? payload.notes : '',
  };

  const result = await SpouseService.insertSpouse(newSpouseEntry);
  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AddRelationship_Child = async (sourceMember: Member, targetMember: Member, payload: any) => {
  // console.log('Source Member: ', sourceMember);
  // console.log('Target Member: ', targetMember);
  const result = await AddRelationship_Parent(targetMember, sourceMember, payload);
  return result;
};

export const MemberRelationsManagementService = {
  AddSiblingMember,
  AddChildMember,
  AddSpouseMember,
  AddRelationship_Parent,
  AddRelationship_Spouse,
  AddRelationship_Child,
};
