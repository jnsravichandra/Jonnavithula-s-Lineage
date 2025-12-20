import { ModalDialog } from '../../../shared/components/ui';
import type { Member } from '../../../shared/datamodels';
import type { PersonCardActionType } from '../types';

import { MemberForm } from './MemberForm';

export interface MemberActionModalProps {
  refreshFamilyData: () => void;
  personCardActions: PersonCardActionType;
}

function MemberActionModal({ refreshFamilyData, personCardActions }: MemberActionModalProps) {
  const getMemberName = (member: Member) => {
    if (!member) return '';
    return `${member.first_name} ${member.middle_name ? member.middle_name + ' ' : ''}${member.last_name}`;
  };

  const getModalTitle = (): string => {
    const { mode } = personCardActions.ui.modal;
    const { contextMember, member } = personCardActions.data;

    if (mode?.operationType === 'add-linked') {
      return `Add ${mode.relationType} to ${getMemberName(contextMember as Member)}`;
    } else if (mode?.operationType === 'edit') {
      return `Edit ${getMemberName(member as Member)}`;
    }
    return 'Add New Member';
  };

  if (!personCardActions.handlers) return null;

  return (
    <ModalDialog
      open={personCardActions.ui.modal.isOpen}
      onClose={personCardActions.ui.modal.close}
      title={getModalTitle()}
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
