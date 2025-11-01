import type { DescendantLinkage, Member, Spouse, TreeNode } from "../models/SupabaseDataModel";

export function TransformToTree(members: Member[], linkages: DescendantLinkage[], spouses: Spouse[]): TreeNode[] {
  // 1. Initialise the nodes and lookup map
  const nodeMap: { [key: string]: TreeNode } = {};
  const rootNodes: TreeNode[] = [];

  // Create a node for every member and populate the lookup map
  members.forEach((member) => {
    const node: TreeNode = {
      ...(member as TreeNode), // Cast member to TreeNode to satisfy type checking for member_id
      spouses: [],
      children: [],
      isRoot: true, //Assume root until parent is found
    };

    nodeMap[member.member_id!] = node;
  });

  // --- 2. Establish Parent-Child Hierarchy ---
  const hasParent = new Set<string>();

  linkages.forEach((linkage) => {
    const parentNode_father = nodeMap[linkage.parent_a_id];
    const parentNode_mother = nodeMap[linkage.parent_b_id];
    const childNode = nodeMap[linkage.child_id];

    if ((parentNode_father || parentNode_mother) && childNode) {
      if (parentNode_father) {
        parentNode_father.children.push(childNode);
      }

      if (parentNode_mother) {
        parentNode_mother.children.push(childNode);
      }
      // Mark the child as NOT a root
      hasParent.add(linkage.child_id);
    }
    // NOTE: The direction of the linkage (parent_id to child_id) is crucial here.
  });

  // Update the isRoot property based on the linkages found
  members.forEach((m) => {
    if (nodeMap[m.member_id!]) {
      nodeMap[m.member_id!].isRoot = !hasParent.has(m.member_id!);
    }
  });

  // --- 3. Link Spouses ---
  spouses.forEach((s) => {
    const memberA = nodeMap[s.member_a_id];
    const memberB = nodeMap[s.member_b_id];

    if (memberA && memberB) {
      // Spouses should link to each other bidirectionally
      memberA.spouses.push(memberB);
      memberB.spouses.push(memberA);
    }
  });

  // --- 4. Identify True Root(s) for the initial render ---
  // Identify all members who do NOT have a parent linkage recorded.
  const rootSpouses = new Set<string>();
  Object.values(nodeMap).forEach((node) => {
    if (node.isRoot) {
      rootNodes.push(node);
      node.spouses.forEach((spouse) => {
        if (spouse.isRoot) {
          rootSpouses.add(spouse.member_id);
        }
      });
    }
  });
 
  return rootNodes.filter((node) => rootSpouses.has(node.member_id));
}
