import { useEffect, useState } from "react";
import type { TreeNode, Member, DescendantLinkage, Spouse } from "../../../shared/datamodels";
import { MemberService, DescendantLinkageService, SpouseService } from "../services";
import { transformToTree } from "../utils/transformToTree";

export interface TransformedTree {
  rootNode: TreeNode | null;
  roots: TreeNode[];
  unlinkedNodes: TreeNode[];
  linkedNodes: TreeNode[];
}

export interface FamilyData {
  members: Member[];
  linkages: DescendantLinkage[];
  spouses: Spouse[];
}

export type FamilyTreeDataType = {
  familyData: FamilyData;
  transformedTree: TransformedTree;
  loading: boolean;
  error: string | null;
  refreshFamilyData: () => void;
};

function useFamilyTreeData() {
  const [familyData, setFamilyData] = useState<FamilyData | null>(null);
  const [transformedTree, setTransformedTree] = useState<TransformedTree | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshFamilyData = async () => {
    setLoading(true);
    try {
      const [members, linkages, spouses] = await Promise.all([MemberService.getAllMembers(), DescendantLinkageService.getAllDescendantLinkages(), SpouseService.getAllSpouses()]);
      
      // 1. Set Raw Data
      setFamilyData({
        members: members,
        linkages: linkages,
        spouses: spouses,
      });

      // 2. Transform Immediately (No need to wait for a useEffect)
      const { rootNode, roots, unlinkedNodes, allNodes } = transformToTree(members, linkages, spouses);
      setTransformedTree({
        rootNode: rootNode,
        roots: roots,
        unlinkedNodes: unlinkedNodes,
        linkedNodes: allNodes,
      });

    } catch (error) {
      setError('Error while processing family data: ' + error);
      console.error('Error while processing family data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshFamilyData();
  }, []);

  const familyTreeData: FamilyTreeDataType = {
    familyData: familyData as FamilyData,
    transformedTree: transformedTree as TransformedTree,
    loading,
    error,
    refreshFamilyData,
  };

  return familyTreeData;
}

export default useFamilyTreeData;
