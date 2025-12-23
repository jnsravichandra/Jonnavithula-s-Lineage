import { useState, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import type { TreeNode } from '../../../shared/datamodels/SupabaseDataModel';

export const useTreeExpansion = (hierarchy: d3.HierarchyNode<TreeNode> | null) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Expand the root node by default when hierarchy loads
  useEffect(() => {
    if (hierarchy?.data?.member_id) {
      setExpandedNodes((prev) => {
        const next = new Set(prev);
        next.add(hierarchy.data.member_id);
        return next;
      });
    }
  }, [hierarchy]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    if (!hierarchy) return;
    const allIds = new Set<string>();
    hierarchy.each((node) => {
      if (node.children && node.children.length > 0) {
        allIds.add(node.data.member_id);
      }
    });
    setExpandedNodes(allIds);
  }, [hierarchy]);

  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set());
  }, []);

  return { expandedNodes, toggleExpand, expandAll, collapseAll };
};
