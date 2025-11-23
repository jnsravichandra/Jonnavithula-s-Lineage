import type { TreeNode } from "../../models/SupabaseDataModel";

interface MemberDirectoryProps {
  members: TreeNode[];
}

function MemberDirectory({ members }: MemberDirectoryProps) {
  return (
    <>
      {members}
      <h1>Member Directory</h1>{" "}
    </>
  );
}

export default MemberDirectory;
