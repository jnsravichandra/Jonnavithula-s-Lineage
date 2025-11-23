import { useState, useEffect } from "react";
import FamilyTreeView from "../../components/FamilyTree/FamilyTreeView";
import MemberDirectory from "../../components/FamilyTree/MemberDirectory";
import TabbedLayout from "../../components/TabbedLayout";
import { MemberService } from "../../services/MemberService";
import { DescendantLinkageService } from "../../services/DescendantLinkageService";
import { SpouseService } from "../../services/SpouseService";
import { TransformToTree } from "../../services/TransformToTree";
import type { TreeNode } from "../../models/SupabaseDataModel";

const familyTreeTabs = [
  { key: "Family Tree", label: "Family Tree" },
  { key: "Member Directory", label: "Member Directory" },
  { key: "Unlinked Members", label: "Unlinked Members" },
];

function FamilyTree_1() {
  const [activeTabKey, setActiveTabKey] = useState(familyTreeTabs[0].key);
  const [familyTreeData, setFamilyTreeData] = useState<{ rootNode: TreeNode | null; unlinkedNodes: TreeNode[] }>({ rootNode: null, unlinkedNodes: [] });
  const [allMembers, setAllMembers] = useState<TreeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadFamilyData = async () => {
      try {
        setIsLoading(true);
        // Fetch all data in parallel for efficiency
        const [members, linkages, spouses] = await Promise.all([
          MemberService.getAllMembers(),
          DescendantLinkageService.getAllDescendantLinkages(),
          SpouseService.getAllSpouses(),
        ]);

        // Transform the raw data into a tree structure
        const { rootNode, unlinkedNodes, allNodes } = TransformToTree(members, linkages, spouses);
        
        setFamilyTreeData({ rootNode, unlinkedNodes });
        setAllMembers(allNodes);
        setError(null);
      } catch (err) {
        console.error("Failed to load and process family data:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFamilyData();
  }, []); // The empty dependency array ensures this effect runs only once on mount

  const onTabChange = (tabKey: string) => {
    setActiveTabKey(tabKey);
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading Family Tree...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-error">Error loading data: {error.message}</div>;
  }

  return (
    <>
      <TabbedLayout tabs={familyTreeTabs} activeTabKey={activeTabKey} onTabChange={onTabChange}>
        {activeTabKey === "Family Tree" && <FamilyTreeView rootNode={familyTreeData.rootNode} />}
        {activeTabKey === "Member Directory" && <MemberDirectory members={allMembers} />}
        {activeTabKey === "Unlinked Members" && <MemberDirectory members={familyTreeData.unlinkedNodes} />}
      </TabbedLayout>
    </>
  );
}

export default FamilyTree_1;
