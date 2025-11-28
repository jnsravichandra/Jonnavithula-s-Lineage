import usePersonCardActions from "../../hooks/usePersonCardActions";
import type { TreeNode } from "../../models/SupabaseDataModel";
import FamilyGroup from "./FamilyGroup";

interface FamilyTreeViewProps {
  rootNode: TreeNode;
}

function FamilyTreeView({ rootNode }: FamilyTreeViewProps) {
  const personCardActions = usePersonCardActions();
  return (
    <>
      {rootNode && (
        <div className="flex py-xl overflow-auto">
          <FamilyGroup
            member={rootNode!}
            cardActionProps={personCardActions.cardActions!}
          />
        </div>
      )}
    </>
  );
}

export default FamilyTreeView;
