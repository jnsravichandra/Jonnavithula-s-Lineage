import type { TreeNode, Member, DescendantLinkage, Spouse } from "../../../shared/datamodels";

// Helper function for consistent date comparison (handles nulls)
// Returns -1 if 'a' is older/should come first, 1 if 'b' is older/should come first, 0 if equal.
const compareDates = (a: TreeNode, b: TreeNode): number => {
    // Convert to timestamps, using null if the date is missing/null/undefined.
    const dateA = a.birth_date ? new Date(a.birth_date).getTime() : null;
    const dateB = b.birth_date ? new Date(b.birth_date).getTime() : null;

    // --- CASE 1: Explicit Null Handling (Prioritize Undated Members) ---
    
    // If 'a' is undated and 'b' is dated, 'a' comes first (older ancestor).
    if (dateA === null && dateB !== null) {
        return -1; 
    }
    
    // If 'b' is undated and 'a' is dated, 'b' comes first.
    if (dateA !== null && dateB === null) {
        return 1;
    }

    // If both are undated, maintain original order (stable sort).
    if (dateA === null && dateB === null) {
        return 0;
    }

    // --- CASE 2: Chronological Sorting (Ascending: Oldest First) ---

    // Both have valid dates: sort chronologically.
    return dateA! - dateB!;
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
            ...(member as TreeNode),
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
                parentNode_father.children.push(childNode);
                childNode.parents.push(parentNode_father);
            }
            if (parentNode_mother) {
                parentNode_mother.children.push(childNode);
                childNode.parents.push(parentNode_mother);
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
    
    Object.values(nodeMap).forEach(node => {
        // Link spouses (unidirectional is enough here, as the linkage table handles bidirectional link)
        spouses.forEach((s) => {
            const memberA = nodeMap[s.member_a_id];
            const memberB = nodeMap[s.member_b_id];

            if (memberA && memberB) {
                // Check if 'node' is memberA or memberB and add the other as a spouse
                if (node.member_id === memberA.member_id && !node.spouses.some(s => s.member_id === memberB.member_id)) {
                    node.spouses.push(memberB);
                } else if (node.member_id === memberB.member_id && !node.spouses.some(s => s.member_id === memberA.member_id)) {
                    node.spouses.push(memberA);
                }
            }
        });
        
        // 🛠️ FIX 1: SORT CHILDREN (Siblings) HERE
        // This ensures chronological order for siblings, placing undated ancestors first.
        node.children.sort(compareDates);
    });


    // --- 4. Identify True Root(s) for the initial render ---
    
    // Filter down to the potential roots of the main tree structure (roots with children)
    const mainTreeRoots = rootCandidates.filter((m) => m.children.length > 0);
    
    let primaryRoot: TreeNode | null = null;

    if (mainTreeRoots.length > 0) {
        // 🛠️ FIX 2: SORT ROOTS using the same logic (oldest/undated first)
        // This ensures the visualization starts with the most senior ancestor available.
        mainTreeRoots.sort(compareDates); 
        
        // The primary root is the oldest/undated member with children
        primaryRoot = mainTreeRoots[0];
    }


    // Unlinked nodes: Roots that have no children and no spouses (purely isolated)
    const unlinkedRootNodes = rootCandidates.filter((node) => !node.children.length && !node.spouses.length);

    const unlinkedRootIds = new Set(unlinkedRootNodes.map(node => node.member_id));
    const allNodes = Object.values(nodeMap);

    const linkedNodes = allNodes.filter((node) => !unlinkedRootIds.has(node.member_id));

    return { rootNode: primaryRoot, roots: mainTreeRoots, unlinkedNodes: unlinkedRootNodes, allNodes: allNodes, linkedNodes: linkedNodes};
}