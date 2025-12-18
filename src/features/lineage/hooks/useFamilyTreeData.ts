import { useEffect, useState } from "react";
import type { TreeNode, Member, DescendantLinkage, Spouse } from "../../../shared/datamodels";
import { MemberService, DescendantLinkageService, SpouseService, TransformToTree } from "../services";


export interface TransformedTree {
  rootNode: TreeNode | null;
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
      setFamilyData({
        members: members,
        linkages: linkages,
        spouses: spouses,
      });
    } catch (error) {
      setError('Error while fetching Raw family Data' + error);
      console.error('Error while fetching Raw family Data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshFamilyData();
  }, []);

  useEffect(() => {
    if (familyData) {
      setLoading(true);
      try {
        const { rootNode, unlinkedNodes, allNodes } = TransformToTree(familyData.members, familyData.linkages, familyData.spouses);
        setTransformedTree({
          rootNode: rootNode,
          unlinkedNodes: unlinkedNodes,
          linkedNodes: allNodes,
        });
      } catch (error) {
        setError('Error while transforming family Data' + error);
        console.error('Error while transforming family Data', error);
      } finally {
        setLoading(false);
      }
    }
  }, [familyData]);

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
