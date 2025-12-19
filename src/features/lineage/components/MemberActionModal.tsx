import { ModalDialog } from '../../../shared/components/ui';
import type { PersonCardActionType } from '../types';

import { MemberForm } from './MemberForm';

export interface MemberActionModalProps {
  refreshFamilyData: () => void;
  personCardActions: PersonCardActionType;
}

function MemberActionModal({ refreshFamilyData, personCardActions }: MemberActionModalProps) {
  const modalTitle = (): string => {
    if (personCardActions.ui.modal.mode?.operationType === 'add-global') {
      return 'Add New Member';
    } else if (personCardActions.ui.modal.mode?.operationType === 'add-linked') {
      return `Add ${personCardActions.ui.modal.mode.relationType} to ${personCardActions.data.contextMember?.first_name} ${
        personCardActions.data.contextMember?.middle_name ? personCardActions.data.contextMember?.middle_name + ' ' : ''
      } ${personCardActions.data.contextMember?.last_name}`;
    } else if (personCardActions.ui.modal.mode?.operationType === 'edit') {
      return `Edit ${personCardActions.data.member?.first_name} ${personCardActions.data.member?.middle_name} ${personCardActions.data.member?.last_name}`;
    } else {
      return 'Add New Member';
    }
  };

  if (!personCardActions.handlers) return null;

  return (
    <ModalDialog
      open={personCardActions.ui.modal.isOpen}
      onClose={personCardActions.ui.modal.close}
      title={modalTitle()}
    >
      <MemberForm
        member={personCardActions.data.member!}
        onClose={personCardActions.handlers.onClose!}
        onSuccess={() => {
          personCardActions.handlers.onSuccess!();
          refreshFamilyData();
        }}
        focussedMemberId={personCardActions.data.focusedMemberId}
        relationType={personCardActions.ui.modal.mode?.relationType ?? null}
        operationType={personCardActions.ui.modal.mode?.operationType ?? ''}
      />
    </ModalDialog>
  );
}

export default MemberActionModal;
