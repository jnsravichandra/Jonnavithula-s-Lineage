import { useCallback, useMemo, useState } from 'react';
import type { Member } from '../../../shared/datamodels/SupabaseDataModel';
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
  deleteMember: (member: Member) => Promise<DeleteResult>;
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
    (relationType: 'Spouse' | 'Child' | 'Sibling' | 'Parent', memberId?: string) => {
      const targetId = memberId || addContextMenu?.memberId;
      if (targetId) {
        setFocusedMemberId(targetId);
        openModal({ operationType: 'add-linked', relationType });
        getMemberDetails('', targetId);
        if (addContextMenu) closeAddContextMenu();
      }
    },
    [addContextMenu, closeAddContextMenu, getMemberDetails, openModal, setFocusedMemberId]
  );

  const handleAdd1 = useCallback(
    (relationType: 'Spouse' | 'Child' | 'Sibling' | 'Parent' | 'Global', memberId: string) => {
      if (relationType === 'Global') {
        setFocusedMemberId(null);
        openModal({ operationType: 'add-global', relationType: null });
        getMemberDetails('', '');
      } else {
        setFocusedMemberId(memberId);
        openModal({ operationType: 'add-linked', relationType });
        getMemberDetails('', memberId);
      }
    },
    [getMemberDetails, openModal]
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

  const handleLink = useCallback(
    (memberId: string) => {
      setFocusedMemberId(memberId);
      openModal({ operationType: 'update-link', relationType: null });
      getMemberDetails(memberId, '');
    },
    [getMemberDetails, openModal]
  );

  const handleShare = useCallback(async (memberId: string) => {
    const url = new URL(window.location.href);
    // url.searchParams.set('focusedMemberId', memberId);
    const shareUrl = url.toString();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Family Tree Member',
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err, memberId);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  }, []);

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
      onAdd1: handleAdd1,
      onLink: handleLink,
      onShare: handleShare,
      onClose: handleClose,
      onSuccess: handleSuccess,
      onAddRelation: openAddRelationModal,
    }),
    [handleSelect, handleEdit, deleteMember, handleAdd, handleAdd1, handleLink, handleShare, handleClose, handleSuccess, openAddRelationModal]
  );

  const addContextMenuOptions = useMemo(
    () => [
      { label: 'Add Spouse', action: () => openAddRelationModal('Spouse') },
      { label: 'Add Child', action: () => openAddRelationModal('Child') },
      { label: 'Add Sibling', action: () => openAddRelationModal('Sibling') },
      // { label: 'Add Parent', action: () => openAddRelationModal('Parent') },
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
