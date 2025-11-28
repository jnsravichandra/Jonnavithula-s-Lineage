import { useState } from "react";
import FamilyTreeView from "../../components/FamilyTree/FamilyTreeView";
import MemberDirectory from "../../components/FamilyTree/MemberDirectory";
import TabbedLayout from "../../components/TabbedLayout";
import useFamilyTreeData from "../../hooks/useFamilyTreeData";
import AddMember from "../../components/FamilyTree/AddMember";
import UnlinkedMembers from "../../components/FamilyTree/UnlinkedMember";

const familyTreeTabs = [
  { key: "Family Tree", label: "Family Tree" },
  { key: "Member Directory", label: "Member Directory" },
  { key: "Unlinked Members", label: "Unlinked Members" },
];

function FamilyTree() {
  const [activeTabKey, setActiveTabKey] = useState(familyTreeTabs[0].key);

  const familyTreeData = useFamilyTreeData();

  const onTabChange = (tabKey: string) => {
    setActiveTabKey(tabKey);
  };

  return (
    <>
      <div className="p-0 bg-background-secondary rounded-2xl shadow-2xl">
        <div className="p-2 float-end">
          <AddMember />
        </div>
        <TabbedLayout
          tabs={familyTreeTabs}
          activeTabKey={activeTabKey}
          onTabChange={onTabChange}
        >
          {activeTabKey === "Family Tree" && (
            <>
              {familyTreeData.transformedTree?.rootNode && (
                <FamilyTreeView
                  rootNode={familyTreeData.transformedTree?.rootNode}
                />
              )}
            </>
          )}
          {activeTabKey === "Member Directory" && <MemberDirectory />}
          {activeTabKey === "Unlinked Members" && (
            <>
              {familyTreeData.transformedTree?.unlinkedNodes && (
                <UnlinkedMembers
                  unlinkedNodes={familyTreeData.transformedTree?.unlinkedNodes}
                />
              )}
            </>
          )}
        </TabbedLayout>
      </div>
    </>
  );
}

export default FamilyTree;
