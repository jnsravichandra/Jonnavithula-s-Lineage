import { useEffect, useState, useCallback } from 'react';
import type { Member, TreeNode } from '../models/SupabaseDataModel';
import { MemberService } from '../services/MemberService';

export type DeleteResult = {
  success: boolean;
  message: string;
};

export type ContextMenuState = {
  memberId: string;
  x: number;
  y: number;
} | null;

export interface CardActionProps {
  onSelect: (memberId: string) => void;
  onEdit: (memberId: string) => void;
  // Let's use the full member object to provide a better success message.
  onDelete: (member: TreeNode) => Promise<DeleteResult>;
  // Optional arguments for global vs. contextual add
  onAdd: (memberId?: string, event?: React.MouseEvent) => void;
  onClose?: () => void;
  onSuccess?: () => void;
  focusedMemberId: string;
}

export type PersonCardActionType = {
  cardActions: CardActionProps;
  focusedMemberId: string | null;
  setFocusedMemberId: (memberId: string | null) => void;
  member: Member | null;
  contextMember: Member | null;
  isModalOpen: boolean;
  modalMode: {
    operationType: 'add-global' | 'add-linked' | 'edit';
    relationType: 'Spouse' | 'Child' | 'Sibling' | 'Parent' | null;
  } | null;
  setIsModalOpen: (isOpen: boolean) => void;
  addContextMenu: ContextMenuState;
  closeAddContextMenu: () => void;
  addContextMenuOptions: { label: string; action: () => void }[];
};

function usePersonCardActions() {
  const [focusedMemberId, setFocusedMemberId] = useState<string | null>(null);
  const [member, setMember] = useState<Member | null>();
  const [contextMember, setContextMember] = useState<Member | null>();
  const [modalMode, setModalMode] = useState<{
    operationType: 'add-global' | 'add-linked' | 'edit';
    relationType: 'Spouse' | 'Child' | 'Sibling' | 'Parent' | null;
  } | null>(null);

  const [cardActions, setCardActions] = useState<CardActionProps>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addContextMenu, setAddContextMenu] = useState<ContextMenuState>(null);

  const closeAddContextMenu = useCallback(() => {
    setAddContextMenu(null);
  }, []);

  const getMember = useCallback(async (memberId: string, contextMemberId: string) => {
    if (memberId) {
      const currentMember: Member | null = await MemberService.getMemberById(memberId);
      if (currentMember) {
        setMember(currentMember);
      }
    } else {
      setMember(null);
    }

    if (contextMemberId) {
      const currentMember: Member | null = await MemberService.getMemberById(contextMemberId);
      if (currentMember) {
        setContextMember(currentMember);
      }
    } else {
      setContextMember(null);
    }
  }, []);

  const handleSelect = useCallback(
    async (memberId: string | null) => {
      setFocusedMemberId(memberId);
      // console.log(`Select ${memberId}`);
      if (memberId) {
        getMember(memberId, memberId);
      }
    },
    [getMember]
  );

  const handleEdit = useCallback(
    async (memberId: string) => {
      setFocusedMemberId(memberId);
      setModalMode({ operationType: 'edit', relationType: null });
      setIsModalOpen(true);
      getMember(memberId, memberId);
    },
    [getMember]
  );

  const handleDelete = useCallback(async (member: TreeNode): Promise<DeleteResult> => {
    // console.log(`Delete ${member.member_id}`);
    try {
      await MemberService.deleteMember(member.member_id);
      const successMessage = `Member "${member.first_name} ${member.last_name || ''}" was deleted successfully.`;
      return { success: true, message: successMessage };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = `Failed to delete member: ${error.message}`;
      return { success: false, message: errorMessage };
    }
  }, []);

  const openAddRelationModal = useCallback(
    (relationType: 'Spouse' | 'Child' | 'Sibling' | 'Parent') => {
      if (addContextMenu) {
        // This is where you would set state for the modal to know what to do
        console.log(`Adding ${relationType} to member ${addContextMenu.memberId}`);
        setFocusedMemberId(addContextMenu.memberId);
        setModalMode({
          operationType: 'add-linked',
          relationType: relationType,
        });
        getMember('', addContextMenu.memberId);
        setIsModalOpen(true); // Open the modal
        setAddContextMenu(null); // Close the context menu
      }
    },
    [addContextMenu, getMember]
  );

  const handleAdd = useCallback(
    (memberId?: string, event?: React.MouseEvent) => {
      // Case 1: Contextual Add (from a PersonCard)
      if (memberId && event) {
        event.stopPropagation();
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        setAddContextMenu({ memberId, x: rect.right, y: rect.bottom });
      } else {
        // Case 2: Global Add (no context)
        setFocusedMemberId(null);
        setModalMode({ operationType: 'add-global', relationType: null });
        getMember('', '');
        setIsModalOpen(true);
      }
    },
    [getMember]
  );

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    setFocusedMemberId(null);
    setModalMode(null);
    getMember('', '');
  }, [getMember]);

  const handleSuccess = useCallback(() => {
    setIsModalOpen(false);
    setModalMode(null);
    setFocusedMemberId(null);
  }, []);

  const addContextMenuOptions = [
    { label: 'Add Spouse', action: () => openAddRelationModal('Spouse') },
    { label: 'Add Child', action: () => openAddRelationModal('Child') },
    { label: 'Add Sibling', action: () => openAddRelationModal('Sibling') },
    { label: 'Add Parent', action: () => openAddRelationModal('Parent') },
  ];

  useEffect(() => {
    setCardActions({
      onSelect: handleSelect,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onAdd: handleAdd,
      onClose: handleClose,
      onSuccess: handleSuccess,
      focusedMemberId: focusedMemberId!,
    });
  }, [focusedMemberId, handleAdd, handleClose, handleDelete, handleEdit, handleSelect, handleSuccess]);

  const personCardActions: PersonCardActionType = {
    cardActions: cardActions as CardActionProps, // Type assertion as it's always set in useEffect
    focusedMemberId,
    setFocusedMemberId,
    member: member as Member | null,
    contextMember: contextMember as Member | null,
    isModalOpen,
    modalMode,
    setIsModalOpen,
    addContextMenu,
    closeAddContextMenu,
    addContextMenuOptions,
  };

  return personCardActions;
}

export default usePersonCardActions;
