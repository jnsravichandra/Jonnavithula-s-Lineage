import { useContextMenu } from './useContextMenu';
import { useDeleteMember } from './useDeleteMember';
import { useMemberDetails } from './useMemberDetails';
import { useMemberModal } from './useMemberModal';
import { usePersonCardHandlers } from './usePersonCardHandlers';
import type { PersonCardActionType } from '../types';

function usePersonCardActions() {
  // --- 1. Instantiate Capabilities ---
  const memberDetails = useMemberDetails();
  const memberModal = useMemberModal();
  const {
    actions: { deleteMember },
  } = useDeleteMember();
  const contextMenu = useContextMenu();

  // --- 2. Wire up Workflows ---
  const {
    state: { focusedMemberId },
    actions: { setFocusedMemberId },
    handlers: cardActions,
    options: { addContextMenuOptions },
  } = usePersonCardHandlers({
    memberDetails,
    memberModal,
    deleteMember,
    contextMenu,
  });

  const personCardActions: PersonCardActionType = {
    data: {
      member: memberDetails.state.member,
      contextMember: memberDetails.state.contextMember,
      focusedMemberId,
    },
    ui: {
      modal: {
        isOpen: memberModal.state.isModalOpen,
        mode: memberModal.state.modalMode,
        close: memberModal.actions.closeModal,
      },
      contextMenu: {
        state: contextMenu.state.contextMenu,
        close: contextMenu.actions.closeContextMenu,
        options: addContextMenuOptions,
      },
    },
    handlers: cardActions,
    actions: {
      setFocusedMemberId,
    },
  };

  return personCardActions;
}

export default usePersonCardActions;
