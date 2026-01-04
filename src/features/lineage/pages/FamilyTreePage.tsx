import { useEffect, useState } from 'react';
import { ListBulletIcon, UsersIcon, UserMinusIcon } from '@heroicons/react/24/solid';
import TabbedLayout from '../../../shared/components/ui/TabbedLayout';
import { ContextMenu } from '../../../shared/components/ui/ContextMenu';
import Loading from '../../../shared/components/ui/Loading';
import { useFamilyTreeData, useFamilyTreeRouting, usePersonCardActions, useRefreshedActions } from '../hooks';
import { useAuth } from '../../../shared/hooks/useAuth';
import { AddMemberButton, FamilyTreeView, MemberActionModal, MemberDirectory, UnlinkedMembers } from '../components';
import FamilyTreeView1 from '../components/tree1/FamilyTree';

let familyTreeTabs = [
  { key: 'Member Directory', label: 'Member Directory', icon: <ListBulletIcon className="w-5 h-5" />, isSecured: false },
  // { key: 'Family Tree', label: 'Family Tree', icon: <UsersIcon className="w-5 h-5" /> , isSecured: false},
  { key: 'Family Tree D3', label: 'Family Tree', icon: <UsersIcon className="w-5 h-5" /> , isSecured: false},
  { key: 'Unlinked Members', label: 'Unlinked Members', icon: <UserMinusIcon className="w-5 h-5" /> , isSecured: true},
];

function FamilyTree() {
  const { activeTabKey, onTabChange } = useFamilyTreeRouting(familyTreeTabs[0].key);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  const familyTreeData = useFamilyTreeData();
  const personCardActions = usePersonCardActions();
  const { refreshFamilyData } = familyTreeData;

  // Wrap actions to inject refresh logic automatically
  const personCardActionsWithRefresh = useRefreshedActions(personCardActions, refreshFamilyData, setIsLoading);

  useEffect(() => {
    familyTreeTabs = familyTreeTabs.filter((tab) => isLoggedIn ? true : !tab.isSecured );
  });

  return (
    <>
      {isLoading && <Loading />}
      <div className="p-0 bg-background-secondary rounded-2xl shadow-2xl">
        <div className="p-2 float-end">
          {isLoggedIn && personCardActionsWithRefresh.handlers && <AddMemberButton onAdd={personCardActionsWithRefresh.handlers.onAdd} />}
        </div>
        {familyTreeData.hierarchy?.data && (
          <MemberActionModal
            familyTreeData={familyTreeData}
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
            {activeTabKey === 'Family Tree' && familyTreeData.hierarchy?.data && (
              <FamilyTreeView
                familyTreeData={familyTreeData}
                personCardActions={personCardActionsWithRefresh}
              />
            )}
            {activeTabKey === 'Member Directory' && familyTreeData.hierarchy && <MemberDirectory familyTreeData={familyTreeData} personCardActions={personCardActionsWithRefresh} />}
            {activeTabKey === 'Unlinked Members' && familyTreeData.hierarchy && (
              <UnlinkedMembers familyTreeData={familyTreeData} personCardActions={personCardActionsWithRefresh} />
            )}
            {activeTabKey === 'Family Tree D3' && familyTreeData.hierarchy?.data && (
              <FamilyTreeView1
                familyTreeData={familyTreeData}
                personCardActions={personCardActionsWithRefresh}
              />
            )}
          </TabbedLayout>
      </div>
    </>
  );
}

export default FamilyTree;
