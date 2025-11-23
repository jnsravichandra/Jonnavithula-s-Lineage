import type { TreeNode } from "../../models/SupabaseDataModel";
import FamilyGroup from "./FamilyGroup";

interface CardActionProps {
  onSelect: (memberId: string) => void;
  onEdit: (memberId: string) => void;
  onAdd: (memberId: string) => void;
  focusedMemberId: string | null;
}

interface FamilyGroupProps {
  unlinkedNodes: TreeNode[];
  cardActionProps: CardActionProps;
}

function UnlinkedMembers({ unlinkedNodes, cardActionProps }: FamilyGroupProps) {
  return (
    <>
      {/* --- Main Tree Visualization Area --- */}
      {unlinkedNodes.length > 0 && (
        <div className="flex ">
          {unlinkedNodes.map((node) => {
            return <FamilyGroup key={`${node.member_id}` + "-unlinked"} member={node} cardActionProps={cardActionProps} />;
          })}
        </div>
      )}
    </>
  );
}

export default UnlinkedMembers;
