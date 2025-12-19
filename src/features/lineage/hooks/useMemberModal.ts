import { useState, useCallback } from 'react';
import type { MemberModalActions, MemberModalState, ModalMode } from '../types';


export function useMemberModal(): { state: MemberModalState; actions: MemberModalActions } {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);

  const openModal = useCallback((mode: ModalMode) => {
    setModalMode(mode);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalMode(null);
  }, []);

  return {
    state: { isModalOpen, modalMode },
    actions: { openModal, closeModal },
  };
}