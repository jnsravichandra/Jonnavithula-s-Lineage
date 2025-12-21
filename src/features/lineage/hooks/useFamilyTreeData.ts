import { useEffect, useState, useMemo } from "react";
import type { Member, DescendantLinkage, Spouse } from "../../../shared/datamodels";
import { MemberService, DescendantLinkageService, SpouseService } from "../services";
import { transformToTree, type TransformedTreeType } from "../utils/transformToTree";

export interface FamilyData {
  members: Member[];
  linkages: DescendantLinkage[];
  spouses: Spouse[];
}

export type FamilyTreeDataType = {
  familyData: FamilyData | null;
  transformedTree: TransformedTreeType | null;
  loading: boolean;
  error: string | null;
  refreshFamilyData: () => void;
};

function useFamilyTreeData() {
  const [familyData, setFamilyData] = useState<FamilyData | null>(null);
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

    } catch (error) {
      setError('Error while processing family data: ' + error);
      console.error('Error while processing family data', error);
    } finally {
      setLoading(false);
    }
  };

  const transformedTree = useMemo(() => {
    if (!familyData) return null;
    const { rootNode, roots, unlinkedNodes, allNodes, linkedNodes } = transformToTree(familyData.members, familyData.linkages, familyData.spouses);
    return {
      rootNode: rootNode,
      roots: roots,
      unlinkedNodes: unlinkedNodes,
      linkedNodes: linkedNodes,
      allNodes: allNodes,
    };
  }, [familyData]);

  useEffect(() => {
    refreshFamilyData();
  }, []);

  const familyTreeData: FamilyTreeDataType = {
    familyData,
    transformedTree,
    loading,
    error,
    refreshFamilyData,
  };

  return familyTreeData;
}

export default useFamilyTreeData;
