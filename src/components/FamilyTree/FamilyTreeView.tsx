import type { TreeNode } from "../../models/SupabaseDataModel";

interface FamilyTreeViewProps {
  rootNode: TreeNode | null;
}

function FamilyTreeView( {rootNode}: FamilyTreeViewProps ) {
  return (
    <>
    {JSON.stringify(rootNode)}
      <h1>Family Tree View</h1>
    </>
  );
}

export default FamilyTreeView;
