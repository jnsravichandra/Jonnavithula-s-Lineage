import { useCallback } from 'react';
import type { TreeNode } from '../../../shared/datamodels/SupabaseDataModel';
import { MemberService, DescendantLinkageService, SpouseService } from '../services';
import type { DeleteResult, DeleteMemberActions } from '../types';

export function useDeleteMember(): { actions: DeleteMemberActions } {
  const deleteMember = useCallback(async (member: TreeNode): Promise<DeleteResult> => {
    try {
      // Orchestrate the deletion across multiple services
      await DescendantLinkageService.deleteDescendantLinkageByMemberId(member.member_id);
      await SpouseService.deleteSpouseForMember(member.member_id);
      await MemberService.deleteMember(member.member_id);
      
      return { 
        success: true, 
        message: `Member "${member.first_name} ${member.last_name || ''}" was deleted successfully.` 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Failed to delete member: ${error}` 
      };
    }
  }, []);

  return {
    actions: { deleteMember },
  };
}
