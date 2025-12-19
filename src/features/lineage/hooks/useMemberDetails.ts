import { useState, useCallback } from 'react';
import type { Member } from '../../../shared/datamodels/SupabaseDataModel';
import { MemberService } from '../services/MemberService';
import type { MemberDetailsState, MemberDetailsActions } from '../types';

export function useMemberDetails(): { state: MemberDetailsState; actions: MemberDetailsActions } {
  const [member, setMember] = useState<Member | null>(null);
  const [contextMember, setContextMember] = useState<Member | null>(null);

  const getMemberDetails = useCallback(async (memberId: string, contextMemberId: string) => {
    if (memberId) {
      const currentMember: Member | null = await MemberService.getMemberById(memberId);
      if (currentMember) {
        setMember(currentMember);
      }
    } else {
      setMember(null);
    }

    if (contextMemberId) {
      const currentMember: Member | null = await MemberService.getMemberById(contextMemberId);
      if (currentMember) {
        setContextMember(currentMember);
      }
    } else {
      setContextMember(null);
    }
  }, []);

  return {
    state: { member, contextMember },
    actions: { getMemberDetails },
  };
}
