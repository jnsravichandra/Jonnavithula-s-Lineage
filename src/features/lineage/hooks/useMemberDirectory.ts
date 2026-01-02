import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { transformToD3Tree } from '../utils/transformToD3Tree';
import type { Member, TreeNode } from '../../../shared/datamodels/SupabaseDataModel';
import type { FamilyTreeDataType } from './useFamilyTreeData';
import { MemberService } from '../services';

export const useMemberDirectory = (familyTreeData: FamilyTreeDataType) => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const selectedMemberId = memberId || null;
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const { familyData } = familyTreeData;


  // 1. Transform Data
  // Memoize this to prevent D3 from recalculating the hierarchy on every render
  // const hierarchy: d3.HierarchyNode<TreeNode> | null = useMemo(() => {
  //   if (!transformedTree?.rootNode) return null;
  //   return transformToD3Tree(transformedTree.rootNode);
  // }, [transformedTree]);

  const allMembers = useMemo(() => {
    if (!familyData?.members) return [];
    return familyData.members.map((member) => ({
      ...member,
      id: member.member_id,
      name: [member.first_name, member.middle_name, member.last_name].filter(Boolean).join(' '),
    })) as unknown as TreeNode[];
  }, [familyData]);

  // 2. Derive Selected Member from the full list of members
  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (!selectedMemberId) {
        setSelectedMember(null);
        return;
      }
      try {
        const memberDetails = await MemberService.getMemberById(selectedMemberId);
        setSelectedMember(memberDetails);
      } catch (error) {
        console.error('Error fetching member details:', error);
      }
    };
    fetchMemberDetails();
  }, [selectedMemberId]);

  // 3. Handlers
  const handleMemberClick = useCallback((memberId: string) => {
    navigate(`/family-tree/directory/${memberId}`);
  }, [navigate]);

  return {
    allMembers, // A flat array of all members (linked + unlinked)
    selectedMember,
    setSelectedMember,
    handleMemberClick,
  };
};
