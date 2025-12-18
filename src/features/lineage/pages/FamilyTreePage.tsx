import { useState } from "react";
import TabbedLayout from "../../../shared/components/ui/TabbedLayout";
import { useFamilyTreeData, usePersonCardActions } from "../hooks";
import { AddMember, FamilyTreeView, MemberDirectory, UnlinkedMembers } from "../components";



const familyTreeTabs = [
  { key: 'Family Tree', label: 'Family Tree' },
  { key: 'Member Directory', label: 'Member Directory' },
  { key: 'Unlinked Members', label: 'Unlinked Members' },
];

function FamilyTree() {
  const [activeTabKey, setActiveTabKey] = useState(familyTreeTabs[0].key);

  const familyTreeData = useFamilyTreeData();
  const personCardActions = usePersonCardActions();

  const onTabChange = (tabKey: string) => {
    setActiveTabKey(tabKey);
  };

  return (
    <>
      <div className="p-0 bg-background-secondary rounded-2xl shadow-2xl">
        <div className="p-2 float-end">
          <AddMember refreshFamilyData={familyTreeData.refreshFamilyData} personCardActions={personCardActions} />
        </div>
        <TabbedLayout tabs={familyTreeTabs} activeTabKey={activeTabKey} onTabChange={onTabChange}>
          {activeTabKey === 'Family Tree' && (
            <>
              {familyTreeData.transformedTree?.rootNode && (
                <FamilyTreeView
                  rootNode={familyTreeData.transformedTree?.rootNode}
                  cardActions={personCardActions.cardActions!}
                  addContextMenu={personCardActions.addContextMenu}
                  closeAddContextMenu={personCardActions.closeAddContextMenu}
                  addContextMenuOptions={personCardActions.addContextMenuOptions}
                />
              )}
            </>
          )}
          {activeTabKey === 'Member Directory' && <MemberDirectory />}
          {activeTabKey === 'Unlinked Members' && (
            <>
              {familyTreeData.transformedTree?.unlinkedNodes && (
                <UnlinkedMembers
                  unlinkedNodes={familyTreeData.transformedTree?.unlinkedNodes}
                  refreshFamilyData={familyTreeData.refreshFamilyData}
                  personCardActions={personCardActions}
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
