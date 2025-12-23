import { useState } from 'react';
import { ListBulletIcon, UsersIcon, UserMinusIcon } from '@heroicons/react/24/solid';
import TabbedLayout from '../../../shared/components/ui/TabbedLayout';
import { ContextMenu } from '../../../shared/components/ui/ContextMenu';
import Loading from '../../../shared/components/ui/Loading';
import { useFamilyTreeData, useFamilyTreeRouting, usePersonCardActions, useRefreshedActions } from '../hooks';
import { useAuth } from '../../../shared/hooks/useAuth';
import { AddMember, FamilyTreeView, MemberActionModal, MemberDirectory, UnlinkedMembers } from '../components';

const familyTreeTabs = [
  { key: 'Member Directory', label: 'Member Directory', icon: <ListBulletIcon className="w-5 h-5" /> },
  { key: 'Family Tree', label: 'Family Tree', icon: <UsersIcon className="w-5 h-5" /> },
  { key: 'Unlinked Members', label: 'Unlinked Members', icon: <UserMinusIcon className="w-5 h-5" /> },
];

function FamilyTree() {
  const { activeTabKey, onTabChange } = useFamilyTreeRouting(familyTreeTabs[0].key);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  const familyTreeData = useFamilyTreeData();
  const personCardActions = usePersonCardActions();
  const { refreshFamilyData, transformedTree } = familyTreeData;

  // Wrap actions to inject refresh logic automatically
  const personCardActionsWithRefresh = useRefreshedActions(personCardActions, refreshFamilyData, setIsLoading);

  return (
    <>
      {isLoading && <Loading />}
      <div className="p-0 bg-background-secondary rounded-2xl shadow-2xl">
        <div className="p-2 float-end">
          {isLoggedIn && personCardActionsWithRefresh.handlers && <AddMember onAdd={personCardActionsWithRefresh.handlers.onAdd} />}
        </div>
        {transformedTree && (
          <MemberActionModal
            transformedTree={transformedTree}
            refreshFamilyData={familyTreeData.refreshFamilyData}
            personCardActions={personCardActionsWithRefresh}
          />
        )}
        {personCardActions.ui.contextMenu.state && (
          <ContextMenu
            x={personCardActions.ui.contextMenu.state.x}
            y={personCardActions.ui.contextMenu.state.y}
            options={personCardActions.ui.contextMenu.options}
            onClose={personCardActions.ui.contextMenu.close}
          />
        )}
        <TabbedLayout tabs={familyTreeTabs} activeTabKey={activeTabKey} onTabChange={onTabChange}>
          {activeTabKey === 'Family Tree' &&
            familyTreeData.transformedTree?.rootNode && (
              <FamilyTreeView
                rootNode={familyTreeData.transformedTree?.rootNode}
                personCardActions={personCardActionsWithRefresh}
                closeAddContextMenu={personCardActions.ui.contextMenu.close}
              />
            )}
          {activeTabKey === 'Member Directory' && familyTreeData.transformedTree && <MemberDirectory familyTreeData={familyTreeData} />}
          {activeTabKey === 'Unlinked Members' &&
            familyTreeData.transformedTree?.unlinkedNodes && (
              <UnlinkedMembers unlinkedNodes={familyTreeData.transformedTree?.unlinkedNodes} personCardActions={personCardActionsWithRefresh} />
            )}
        </TabbedLayout>
      </div>
    </>
  );
}

export default FamilyTree;
