import { useState, useMemo } from "react";
import TabbedLayout from "../../../shared/components/ui/TabbedLayout";
import { ContextMenu } from "../../../shared/components/ui/ContextMenu";
import Loading from "../../../shared/components/ui/Loading";
import { useFamilyTreeData, usePersonCardActions } from "../hooks";
import { AddMember, FamilyTreeView, MemberActionModal, MemberDirectory, UnlinkedMembers } from "../components";
import type { Member } from "../../../shared/datamodels";
import type { PersonCardActionType } from "../types";



const familyTreeTabs = [
  { key: 'Family Tree', label: 'Family Tree' },
  { key: 'Member Directory', label: 'Member Directory' },
  { key: 'Unlinked Members', label: 'Unlinked Members' },
];

function FamilyTree() {
  const [activeTabKey, setActiveTabKey] = useState(familyTreeTabs[0].key);
  const [isLoading, setIsLoading] = useState(false);

  const familyTreeData = useFamilyTreeData();
  const personCardActions = usePersonCardActions();

  // Wrap actions to inject refresh logic automatically
  const personCardActionsWithRefresh: PersonCardActionType = useMemo(() => {
    if (!personCardActions.handlers) return personCardActions;
    return {
      ...personCardActions,
      handlers: {
        ...personCardActions.handlers,
        onSuccess: async () => {
          setIsLoading(true);
          try {
            personCardActions.handlers.onSuccess?.();
            await familyTreeData.refreshFamilyData();
          } finally {
            setIsLoading(false);
          }
        },
        onDelete: async (member: Member) => {
          setIsLoading(true);
          try {
            await personCardActions.handlers.onDelete(member);
            await familyTreeData.refreshFamilyData(); // Ensure we wait for refresh to complete
          } finally {
            setIsLoading(false);
          }
        },
      },
    };
  }, [personCardActions, familyTreeData]);

  const onTabChange = (tabKey: string) => {
    setActiveTabKey(tabKey);
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="p-0 bg-background-secondary rounded-2xl shadow-2xl">
        <div className="p-2 float-end">
          {personCardActionsWithRefresh.handlers && <AddMember onAdd={personCardActionsWithRefresh.handlers.onAdd} />}
        </div>
        <MemberActionModal refreshFamilyData={familyTreeData.refreshFamilyData} personCardActions={personCardActionsWithRefresh} />
        {personCardActions.ui.contextMenu.state && (
          <ContextMenu
            x={personCardActions.ui.contextMenu.state.x}
            y={personCardActions.ui.contextMenu.state.y}
            options={personCardActions.ui.contextMenu.options}
            onClose={personCardActions.ui.contextMenu.close}
          />
        )}
        <TabbedLayout tabs={familyTreeTabs} activeTabKey={activeTabKey} onTabChange={onTabChange}>
          {activeTabKey === 'Family Tree' && (
            <>
              {familyTreeData.transformedTree?.rootNode && (
                <FamilyTreeView
                  rootNode={familyTreeData.transformedTree?.rootNode}
                  personCardActions={personCardActionsWithRefresh}
                  closeAddContextMenu={personCardActions.ui.contextMenu.close}
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
                  personCardActions={personCardActionsWithRefresh}
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
