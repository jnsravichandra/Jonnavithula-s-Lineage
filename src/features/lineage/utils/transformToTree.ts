import type { TreeNode, Member, DescendantLinkage, Spouse } from '../../../shared/datamodels';
import { hierarchy } from 'd3-hierarchy';

// Helper function for consistent date comparison (handles nulls)
// Returns -1 if 'a' is older/should come first, 1 if 'b' is older/should come first, 0 if equal.
const compareDates = (a: TreeNode, b: TreeNode): number => {
  // Convert to timestamps, using null if the date is missing/null/undefined.
  const dateA = a.member?.birth_date ? new Date(a.member.birth_date).getTime() : null;
  const dateB = b.member?.birth_date ? new Date(b.member.birth_date).getTime() : null;

  // Ensure valid timestamps (handle NaN)
  const validDateA = dateA !== null && !isNaN(dateA) ? dateA : null;
  const validDateB = dateB !== null && !isNaN(dateB) ? dateB : null;

  // --- CASE 1: Explicit Null Handling (Prioritize Undated Members) ---

  // If 'a' is undated and 'b' is dated, 'a' comes first (older ancestor).
  if (validDateA === null && validDateB !== null) {
    return -1;
  }

  // If 'b' is undated and 'a' is dated, 'b' comes first.
  if (validDateA !== null && validDateB === null) {
    return 1;
  }

  // If both are undated, maintain original order (stable sort).
  if (validDateA === null && validDateB === null) {
    return 0;
  }

  // --- CASE 2: Chronological Sorting (Ascending: Oldest First) ---

  // Both have valid dates: sort chronologically.
  return validDateA! - validDateB!;
};

export interface TransformedTreeType {
  allNodes: TreeNode[];
  rootNode: TreeNode | null;
  roots: TreeNode[];
  linkedNodes: TreeNode[];
  unlinkedNodes: TreeNode[];
}

export function transformToTree(members: Member[], linkages: DescendantLinkage[], spouses: Spouse[]): TransformedTreeType {
  const nodeMap: { [key: string]: TreeNode } = {};
  const rootCandidates: TreeNode[] = [];

  // 1. Initialise the nodes
  members.forEach((member) => {
    const node: TreeNode = {
      member_id: member.member_id!,
      member: member,
      spouses: [],
      children: [],
      parents: [],
      isRoot: true, // Assume root until parent is found
    };
    nodeMap[member.member_id!] = node;
  });

  // --- 2. Establish Parent-Child Hierarchy and Linkages ---
  const hasParent = new Set<string>();

  linkages.forEach((linkage) => {
    const parentNode_father = nodeMap[linkage.parent_a_id];
    const parentNode_mother = nodeMap[linkage.parent_b_id];
    const childNode = nodeMap[linkage.child_id];

    if ((parentNode_father || parentNode_mother) && childNode) {
      if (parentNode_father) {
        parentNode_father.children?.push(childNode);
        childNode.parents?.push(parentNode_father);
      }
      if (parentNode_mother) {
        parentNode_mother.children?.push(childNode);
        childNode.parents?.push(parentNode_mother);
      }
      // Mark the child as NOT a root
      hasParent.add(linkage.child_id);
    }
  });

  // Update the isRoot property and collect root candidates
  members.forEach((m) => {
    const node = nodeMap[m.member_id!];
    if (node) {
      node.isRoot = !hasParent.has(m.member_id!);
      if (node.isRoot) {
        rootCandidates.push(node);
      }
    }
  });

  // --- 3. Link Spouses and SORT CHILDREN (Siblings) ---

  // Optimize: Iterate spouses once to link them, instead of nesting inside the node loop.
  spouses.forEach((s) => {
    const memberA = nodeMap[s.member_a_id];
    const memberB = nodeMap[s.member_b_id];

    if (memberA && memberB) {
      if (!memberA.spouses?.some((sp) => sp.member_id === memberB.member_id)) {
        memberA.spouses?.push(memberB);
      }
      if (!memberB.spouses?.some((sp) => sp.member_id === memberA.member_id)) {
        memberB.spouses?.push(memberA);
      }
    }
  });

  Object.values(nodeMap).forEach((node) => {
    // 🛠️ FIX 1: SORT CHILDREN (Siblings) HERE
    // This ensures chronological order for siblings, placing undated ancestors first.
    node.children?.sort(compareDates);
  });

  // --- 4. Identify True Root(s) for the initial render ---

  // Filter down to the potential roots of the main tree structure (roots with children)
  const mainTreeRoots = rootCandidates.filter((m) => m.children!.length > 0);

  let primaryRoot: TreeNode | null = null;

  if (mainTreeRoots.length > 0) {
    // 🛠️ FIX 2: SORT ROOTS using the same logic (oldest/undated first)
    // This ensures the visualization starts with the most senior ancestor available.
    mainTreeRoots.sort(compareDates);

    // The primary root is the oldest/undated member with children
    primaryRoot = mainTreeRoots[0];
  }

  // Unlinked nodes: Roots that have no children and no spouses (purely isolated)
  const unlinkedRootNodes = rootCandidates.filter((node) => !node.children!.length && !node.spouses!.length);

  const unlinkedRootIds = new Set(unlinkedRootNodes.map((node) => node.member_id));
  const allNodes = Object.values(nodeMap);

  const linkedNodes = allNodes.filter((node) => !unlinkedRootIds.has(node.member_id));

  return { rootNode: primaryRoot, roots: mainTreeRoots, unlinkedNodes: unlinkedRootNodes, allNodes: allNodes, linkedNodes: linkedNodes };
}

function buildD3Tree(members: Member[], linkages: DescendantLinkage[], spouses: Spouse[]): Map<string, TreeNode> {
  const nodeMap: Map<string, TreeNode> = new Map<string, TreeNode>();

  // 1. Initialise the nodes
  for (const member of members) {
    const full_name = [member.first_name, member.middle_name, member.last_name].filter(Boolean).join(' ').trim();

    nodeMap.set(String(member.member_id!), {
      member_id: member.member_id!,
      full_name: full_name,
      member: member,
      spouses: [],
      children: [],
      parents: [],
      isRoot: false,
    });
  }

  // --- 2. Link Spouse ---
  for (const s of spouses) {
    const a = nodeMap.get(String(s.member_a_id));
    const b = nodeMap.get(String(s.member_b_id));

    if (!a || !b) continue;

    if (!a.spouses?.includes(b)) a.spouses?.push(b);
    if (!b.spouses?.includes(a)) b.spouses?.push(a);
  }

  // --- 3. Link Parent/Child ---
  for (const l of linkages) {
    const child = nodeMap.get(String(l.child_id));

    if (!child) continue;

    const parents: TreeNode[] = [];

    if (l.parent_a_id != null) {
      const parent_a = nodeMap.get(String(l.parent_a_id));
      if (parent_a) parents.push(parent_a);
    }

    if (l.parent_b_id != null) {
      const parent_b = nodeMap.get(String(l.parent_b_id));
      if (parent_b && !parents.includes(parent_b)) parents.push(parent_b);
    }

    for (const p of parents) {
      if (!p.children?.includes(child)) p.children?.push(child);
      if (!child.parents?.includes(p)) child.parents?.push(p);
    }
  }

  // 4. Mark roots
  for (const n of nodeMap.values()) {
    if (n.parents?.length === 0) n.isRoot = true;
    else n.isRoot = false; // n.parents could be undefined, so check length only if it exists
  }

  return nodeMap;
}

// Helper: clone TreeNode graph, keeping only isInLineage nodes in children[]
function cloneLineageTree(node: TreeNode): TreeNode | null {
  // Relaxed check: treat undefined as true to prevent missing nodes if the flag isn't explicitly set
  const isLineage = node.member?.isInLineage !== false;

  if (!isLineage) return null; // skip non-lineage nodes from hierarchy

  const clonedChildren: TreeNode[] = [];

  for (const child of node.children!) {
    const clonedChild = cloneLineageTree(child);
    if (clonedChild) clonedChildren.push(clonedChild);
  }

  return {
    ...node,
    children: clonedChildren,
    // spouses stay as-is so you can render them adjacent,
    // but they are not part of the hierarchy’s children[]
  };
}

export function buildHierarchyForD3(members: Member[], linkages: DescendantLinkage[], spouses: Spouse[]): d3.HierarchyNode<TreeNode> {
  const nodeMap = buildD3Tree(members, linkages, spouses);
  // console.log('Node Map:', nodeMap);


  // Filter for visual roots: Members in lineage who either have no parents OR have no parents that are in the lineage.
  // This ensures that if a member is linked to a parent who is NOT in the lineage, the member still appears as a root.
  const rootNodes = Array.from(nodeMap.values()).filter((node) => {
    if (!node.member?.isInLineage) return false;
    const hasLineageParent = node.parents?.some((p) => p.member?.isInLineage);
    return !hasLineageParent;
  });

  const virtualRoot: TreeNode = {
    member_id: 'root',
    full_name: 'Root',
    member: undefined,
    spouses: [],
    parents: [],
    isRoot: true,
    children: rootNodes.map((node) => cloneLineageTree(node) as TreeNode).filter((child): child is TreeNode => !!child),
  };

  const root = hierarchy<TreeNode>(virtualRoot, (d) => d.children);

  return root;
}
