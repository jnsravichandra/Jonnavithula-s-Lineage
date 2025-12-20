import { useCallback } from 'react';
import type { Member } from '../../../shared/datamodels/SupabaseDataModel';
import { MemberService, DescendantLinkageService, SpouseService } from '../services';
import type { DeleteResult, DeleteMemberActions } from '../types';
import toast from 'react-hot-toast';


export function useDeleteMember(): { actions: DeleteMemberActions } {
  const deleteMember = useCallback(async (member: Member): Promise<DeleteResult> => {
    try {
      console.log('Deleting member:', member);
      // Orchestrate the deletion across multiple services
      await DescendantLinkageService.deleteDescendantLinkageByMemberId(member.member_id!);
      await SpouseService.deleteSpouseForMember(member.member_id!);
      await MemberService.deleteMember(member.member_id!);

      const message = `Member "${member.first_name} ${member.last_name || ''}" was deleted successfully.` ;

      toast.success(message);
      
      return { 
        success: true, 
        message: `Member "${member.first_name} ${member.last_name || ''}" was deleted successfully.` 
      };
    } catch (error) {
      console.error('Error while deleting member:', error);
      toast.error(`Failed to delete member: ${(error as Error).message}`);
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
