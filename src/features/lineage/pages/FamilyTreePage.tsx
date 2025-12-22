import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ListBulletIcon, UsersIcon, UserMinusIcon } from '@heroicons/react/24/solid';
import TabbedLayout from "../../../shared/components/ui/TabbedLayout";
import { ContextMenu } from "../../../shared/components/ui/ContextMenu";
import Loading from "../../../shared/components/ui/Loading";
import { useFamilyTreeData, usePersonCardActions } from "../hooks";
import { useAuth } from "../../../shared/hooks/useAuth";
import { AddMember, FamilyTreeView, MemberActionModal, MemberDirectory, UnlinkedMembers } from "../components";
import type { Member } from "../../../shared/datamodels";
import type { PersonCardActionType } from "../types";



const familyTreeTabs = [
  { key: 'Member Directory', label: 'Member Directory', icon: <ListBulletIcon className="w-5 h-5" /> },
  { key: 'Family Tree', label: 'Family Tree', icon: <UsersIcon className="w-5 h-5" /> },
  { key: 'Unlinked Members', label: 'Unlinked Members', icon: <UserMinusIcon className="w-5 h-5" /> },
];

const TAB_SLUGS: Record<string, string> = {
  'tree': 'Family Tree',
  'directory': 'Member Directory',
  'unlinked': 'Unlinked Members',
};

const SLUG_TABS: Record<string, string> = {
  'Family Tree': 'tree',
  'Member Directory': 'directory',
  'Unlinked Members': 'unlinked',
};

function FamilyTree() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const activeTabKey = tab ? (TAB_SLUGS[tab] || familyTreeTabs[0].key) : familyTreeTabs[0].key;
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  const familyTreeData = useFamilyTreeData();
  const personCardActions = usePersonCardActions();
  const { refreshFamilyData, transformedTree } = familyTreeData;

  // Redirect to default tab if no tab is present in URL
  useEffect(() => {
    if (!tab) {
      const defaultSlug = SLUG_TABS[familyTreeTabs[0].key];
      navigate(`/family-tree/${defaultSlug}`, { replace: true });
    }
  }, [tab, navigate]);

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
            await refreshFamilyData();
          } finally {
            setIsLoading(false);
          }
        },
        onDelete: async (member: Member) => {
          setIsLoading(true);
          try {
            await personCardActions.handlers.onDelete(member);
            await refreshFamilyData(); // Ensure we wait for refresh to complete
          } finally {
            setIsLoading(false);
          }
        },
      },
    };
  }, [personCardActions, refreshFamilyData]);

  const onTabChange = (tabKey: string) => {
    const slug = SLUG_TABS[tabKey];
    navigate(`/family-tree/${slug}`);
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="p-0 bg-background-secondary rounded-2xl shadow-2xl">
        <div className="p-2 float-end">
          {isLoggedIn && personCardActionsWithRefresh.handlers && <AddMember onAdd={personCardActionsWithRefresh.handlers.onAdd} />}
        </div>
        <MemberActionModal transformedTree={transformedTree!} refreshFamilyData={familyTreeData.refreshFamilyData} personCardActions={personCardActionsWithRefresh} />
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
          {activeTabKey === 'Member Directory' &&
            familyTreeData.transformedTree && (
              <MemberDirectory familyTreeData={familyTreeData} />
            )}
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
