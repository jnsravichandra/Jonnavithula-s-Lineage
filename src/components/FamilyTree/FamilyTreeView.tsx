import type { CardActionProps } from "../../hooks/usePersonCardActions";
import type { TreeNode } from "../../models/SupabaseDataModel";
import FamilyGroup from "./FamilyGroup";

interface FamilyTreeViewProps {
  rootNode: TreeNode;
  cardActions: CardActionProps
}

function FamilyTreeView({ rootNode, cardActions }: FamilyTreeViewProps) {
  return (
    <>
      {rootNode && (
        <div className="flex py-xl overflow-auto">
          <FamilyGroup
            member={rootNode!}
            cardActionProps={cardActions}
          />
        </div>
      )}
    </>
  );
}

export default FamilyTreeView;
