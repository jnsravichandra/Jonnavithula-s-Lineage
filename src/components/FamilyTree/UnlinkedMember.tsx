import toast from "react-hot-toast";
import type { DeleteResult } from "../../hooks/usePersonCardActions";
import usePersonCardActions from "../../hooks/usePersonCardActions";
import type { TreeNode } from "../../models/SupabaseDataModel";
import { PersonCard } from "./PersonCard";

interface UnlinkedMemberProps {
  unlinkedNodes: TreeNode[];
  // This callback will notify the parent component to update its state
  onMemberDeleted?: (deletedMemberId: string) => void;
}

function UnlinkedMembers({ unlinkedNodes, onMemberDeleted }: UnlinkedMemberProps) {
  const personCardActions = usePersonCardActions();

  // This function wraps the delete action to show a toast notification.
  const handleDeleteWithToast = async (member: TreeNode): Promise<DeleteResult> => {
    if (!personCardActions.cardActions) {
      // Return a default error result if actions aren't ready
      return { success: false, message: "Card actions not initialized." };
    }

    // Call the original onDelete function from the hook
    // This function returns a DeleteResult object
    const result = await personCardActions.cardActions.onDelete(member);

    // Show a toast based on the result
    if (result.success) {
      toast.success(result.message);
      // If the parent provided a callback, call it so the UI can be updated
      if (onMemberDeleted) {
        onMemberDeleted(member.member_id);
      }
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
      </div>
    </>
  );
}

export default UnlinkedMembers;
