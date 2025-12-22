import * as d3 from 'd3';
import type { TreeNode } from '../../../shared/datamodels';

/**
 * Transforms the raw Member data into a D3 Hierarchy Node.
 * This utility ensures the data is in the correct shape for d3.tree() or d3.cluster().
 * 
 * @param rootNode - The root Member object of the family tree
 * @returns A d3.HierarchyNode containing the member data
 */
export const transformToD3Tree = (rootNode: TreeNode): d3.HierarchyNode<TreeNode> => {
    // Create the hierarchy. 
  // We assume the 'Member' interface has a 'children' array.
  // If the structure is different (e.g. 'relations'), pass the accessor as the second arg:
  // d3.hierarchy(rootNode, d => d.relations)
  const hierarchy = d3.hierarchy<TreeNode>(rootNode);

  return hierarchy;
};