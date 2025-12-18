import toast from 'react-hot-toast';
import type { DeleteResult, PersonCardActionType } from '../hooks/usePersonCardActions';
import type { TreeNode } from '../../../shared/datamodels/SupabaseDataModel';
import { PersonCard } from './PersonCard';

interface UnlinkedMemberProps {
  unlinkedNodes: TreeNode[];
  refreshFamilyData: () => void;
  personCardActions: PersonCardActionType;
}

function UnlinkedMembers({ unlinkedNodes, refreshFamilyData, personCardActions }: UnlinkedMemberProps) {
  console.log(unlinkedNodes);
  // This function wraps the delete action to show a toast notification.
  const handleDeleteWithToast = async (member: TreeNode): Promise<DeleteResult> => {
    if (!personCardActions.cardActions) {
      // Return a default error result if actions aren't ready
      return { success: false, message: 'Card actions not initialized.' };
    }

    // Call the original onDelete function from the hook
    // This function returns a DeleteResult object
    const result = await personCardActions.cardActions.onDelete(member);

    // Show a toast based on the result
    if (result.success) {
      toast.success(result.message);
      // If the parent provided a callback, call it so the UI can be updated
      refreshFamilyData();
    } else {
      toast.error(result.message);
    }

    // Return the result to satisfy the TypeScript type requirement.
    return result;
  };

  return (
    <>
      <div className="flex">
        {unlinkedNodes.length > 0 &&
          unlinkedNodes.map((node: TreeNode) => (
            <span key={node.member_id} className="p-2 ">
              <PersonCard
                member={node}
                // Spread the original actions, but override onDelete with our new function
                cardActionProps={{
                  ...personCardActions.cardActions!,
                  onDelete: () => handleDeleteWithToast(node),
                }}
              />
            </span>
          ))}
        {unlinkedNodes.length === 0 && (
          <>
            <h1>No unlinked members found.</h1>
          </>
        )}
      </div>
    </>
  );
}

export default UnlinkedMembers;
