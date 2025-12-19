import { useCallback, useMemo, useState } from 'react';
import type { TreeNode } from '../../../shared/datamodels/SupabaseDataModel';
import type {
  PersonCardHandlers,
  PersonCardState,
  PersonCardActions,
  PersonCardOptions,
  MemberDetailsState,
  MemberDetailsActions,
  MemberModalState,
  MemberModalActions,
  ContextMenuHookState,
  ContextMenuActions,
  DeleteResult,
} from '../types';

interface UsePersonCardHandlersProps {
  memberDetails: { state: MemberDetailsState; actions: MemberDetailsActions };
  memberModal: { state: MemberModalState; actions: MemberModalActions };
  deleteMember: (member: TreeNode) => Promise<DeleteResult>;
  contextMenu: { state: ContextMenuHookState; actions: ContextMenuActions };
}

export function usePersonCardHandlers({ memberDetails, memberModal, deleteMember, contextMenu }: UsePersonCardHandlersProps): {
  state: PersonCardState;
  actions: PersonCardActions;
  handlers: PersonCardHandlers;
  options: PersonCardOptions;
} {
  const [focusedMemberId, setFocusedMemberId] = useState<string | null>(null);
  const {
    actions: { getMemberDetails },
  } = memberDetails;
  const {
    actions: { openModal, closeModal },
  } = memberModal;
  const {
    state: { contextMenu: addContextMenu },
    actions: { openContextMenu, closeContextMenu: closeAddContextMenu },
  } = contextMenu;

  const handleSelect = useCallback(
    async (memberId: string | null) => {
      setFocusedMemberId(memberId);
      if (memberId) {
        getMemberDetails(memberId, memberId);
      }
    },
    [getMemberDetails, setFocusedMemberId]
  );

  const handleEdit = useCallback(
    async (memberId: string) => {
      setFocusedMemberId(memberId);
      openModal({ operationType: 'edit', relationType: null });
      getMemberDetails(memberId, memberId);
    },
    [getMemberDetails, openModal, setFocusedMemberId]
  );

  const openAddRelationModal = useCallback(
    (relationType: 'Spouse' | 'Child' | 'Sibling' | 'Parent') => {
      if (addContextMenu) {
        setFocusedMemberId(addContextMenu.memberId);
        openModal({ operationType: 'add-linked', relationType });
        getMemberDetails('', addContextMenu.memberId);
        closeAddContextMenu();
      }
    },
    [addContextMenu, closeAddContextMenu, getMemberDetails, openModal, setFocusedMemberId]
  );

  const handleAdd = useCallback(
    (memberId?: string, event?: React.MouseEvent) => {
      if (memberId && event) {
        openContextMenu(memberId, event);
      } else {
        setFocusedMemberId(null);
        openModal({ operationType: 'add-global', relationType: null });
        getMemberDetails('', '');
      }
    },
    [getMemberDetails, openModal, openContextMenu, setFocusedMemberId]
  );

  const handleClose = useCallback(() => {
    closeModal();
    setFocusedMemberId(null);
    getMemberDetails('', '');
  }, [closeModal, getMemberDetails, setFocusedMemberId]);

  const handleSuccess = useCallback(() => {
    closeModal();
    setFocusedMemberId(null);
  }, [closeModal, setFocusedMemberId]);

  const cardActions = useMemo<PersonCardHandlers>(
    () => ({
      onSelect: handleSelect,
      onEdit: handleEdit,
      onDelete: deleteMember,
      onAdd: handleAdd,
      onClose: handleClose,
      onSuccess: handleSuccess,
    }),
    [handleAdd, handleClose, deleteMember, handleEdit, handleSelect, handleSuccess]
  );

  const addContextMenuOptions = useMemo(
    () => [
      { label: 'Add Spouse', action: () => openAddRelationModal('Spouse') },
      { label: 'Add Child', action: () => openAddRelationModal('Child') },
      { label: 'Add Sibling', action: () => openAddRelationModal('Sibling') },
      { label: 'Add Parent', action: () => openAddRelationModal('Parent') },
    ],
    [openAddRelationModal]
  );

  return {
    state: { focusedMemberId },
    actions: { setFocusedMemberId },
    handlers: cardActions,
    options: { addContextMenuOptions },
  };
}
