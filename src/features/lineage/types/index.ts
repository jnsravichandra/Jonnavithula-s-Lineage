import type { Member, TreeNode } from '../../../shared/datamodels/SupabaseDataModel';

// --- Member Details ---
export interface MemberDetailsState {
  member: Member | null;
  contextMember: Member | null;
}

export interface MemberDetailsActions {
  getMemberDetails: (memberId: string, contextMemberId: string) => Promise<void>;
}

// --- Member Modal ---
export type ModalMode = {
  operationType: 'add-global' | 'add-linked' | 'edit';
  relationType: 'Spouse' | 'Child' | 'Sibling' | 'Parent' | null;
} | null;

export interface MemberModalState {
  isModalOpen: boolean;
  modalMode: ModalMode;
}

export interface MemberModalActions {
  openModal: (mode: ModalMode) => void;
  closeModal: () => void;
}

// --- Context Menu ---
export type ContextMenuState = {
  memberId: string;
  anchorEl: HTMLElement;
  x: number;
  y: number;
} | null;

export interface ContextMenuHookState {
  contextMenu: ContextMenuState;
}

export interface ContextMenuActions {
  openContextMenu: (memberId: string, event: React.MouseEvent) => void;
  closeContextMenu: () => void;
}

// --- Delete Member ---
export type DeleteResult = {
  success: boolean;
  message: string;
};

export interface DeleteMemberActions {
  deleteMember: (member: TreeNode) => Promise<DeleteResult>;
}

// --- Person Card Handlers ---
export interface PersonCardHandlers {
  onSelect: (memberId: string) => void;
  onEdit: (memberId: string) => void;
  onDelete: (member: TreeNode) => Promise<DeleteResult>;
  onAdd: (memberId?: string, event?: React.MouseEvent) => void;
  onClose?: () => void;
  onSuccess?: () => void;
}

export interface PersonCardState {
  focusedMemberId: string | null;
}

export interface PersonCardActions {
  setFocusedMemberId: (id: string | null) => void;
}

export interface PersonCardOptions {
  addContextMenuOptions: { label: string; action: () => void }[];
}

// --- Main Controller (Public API) ---
export type PersonCardActionType = {
  data: MemberDetailsState & PersonCardState;
  ui: {
    modal: { isOpen: boolean; mode: ModalMode; close: () => void };
    contextMenu: { state: ContextMenuState; close: () => void; options: PersonCardOptions['addContextMenuOptions'] };
  };
  handlers: PersonCardHandlers;
  actions: PersonCardActions;
};
