import { useEffect, useState, useMemo, useCallback } from 'react';
import type { Member, DescendantLinkage, Spouse, TreeNode } from '../../../shared/datamodels';
import { MemberService, DescendantLinkageService, SpouseService } from '../services';
import { buildHierarchyForD3 } from '../utils/transformToTree';
import { useNavigate } from 'react-router-dom';

export interface FamilyData {
  members: Member[];
  linkages: DescendantLinkage[];
  spouses: Spouse[];
}

export type FamilyTreeDataType = {
  familyData: FamilyData | null;
  hierarchy: d3.HierarchyNode<TreeNode> | null;
  selectedMember: Member | null;
  setSelectedMember: (member: Member | null) => void;
  handleMemberClick: (memberId: string) => void;
  loading: boolean;
  error: string | null;
  refreshFamilyData: () => void;
  unassociatedMembers: Member[];
};

function useFamilyTreeData() {
  const navigate = useNavigate();
  const [familyData, setFamilyData] = useState<FamilyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const refreshFamilyData = async () => {
    setLoading(true);
    try {
      const [members, linkages, spouses] = await Promise.all([
        MemberService.getAllMembers(),
        DescendantLinkageService.getAllDescendantLinkages(),
        SpouseService.getAllSpouses(),
      ]);

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

  const hierarchy: d3.HierarchyNode<TreeNode> | null = useMemo(() => {
    console.log('Building hierarchy...');
    // console.log('Family Data:', familyData);
    const rootNode = buildHierarchyForD3(familyData?.members || [], familyData?.linkages || [], familyData?.spouses || []);
    // console.log('Root Node:', rootNode);
    return rootNode;
  }, [familyData?.linkages, familyData?.members, familyData?.spouses]);

  const unassociatedMembers = useMemo(() => {
    if (!familyData) return [];
    const { members, linkages, spouses } = familyData;

    const childIds = new Set(linkages.map((l) => l.child_id));
    const spouseIds = new Set<string>();
    spouses.forEach((s) => {
      spouseIds.add(s.member_a_id);
      spouseIds.add(s.member_b_id);
    });

    return members.filter((m) => !childIds.has(m.member_id!) && !spouseIds.has(m.member_id!));
  }, [familyData]);

  useEffect(() => {
    refreshFamilyData();
  }, []);

  const handleMemberClick = useCallback(
    (memberId: string) => {
      setSelectedMember(familyData?.members.find((member) => member.member_id === memberId) || null);
      navigate(`/family-tree/directory/${memberId}`);
    },
    [familyData?.members, navigate]
  );

  const familyTreeData: FamilyTreeDataType = {
    familyData,
    refreshFamilyData,
    selectedMember,
    setSelectedMember,
    hierarchy,
    handleMemberClick,
    loading,
    error,
    unassociatedMembers,
  };

  // console.log('Family Tree Data:', familyTreeData);

  return familyTreeData;
}

export default useFamilyTreeData;
