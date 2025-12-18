import { PlusIcon } from '@heroicons/react/24/solid';
import type { PersonCardActionType } from '../hooks';
import { ModalDialog } from '../../../shared/components/ui/ModalDialogComponent';
import { MemberForm } from './MemberForm';


interface AddMemberProps {
  refreshFamilyData: () => void;
  personCardActions: PersonCardActionType;
}

function AddMember({ refreshFamilyData, personCardActions }: AddMemberProps) {
  const handleGlobalAdd = () => {
    personCardActions.cardActions?.onAdd('');
  };

  const AddMember_Modal = () => {
    // console.log(personCardActions);
    const modalTitle = (): string => {
      if (personCardActions.modalMode?.operationType === 'add-global') {
        return 'Add New Member';
      } else if (personCardActions.modalMode?.operationType === 'add-linked') {
        return `Add ${personCardActions.modalMode.relationType} to ${personCardActions.contextMember?.first_name} ${
          personCardActions.contextMember?.middle_name ? personCardActions.contextMember?.middle_name + ' ' : ''
        } ${personCardActions.contextMember?.last_name}`;
      } else if (personCardActions.modalMode?.operationType === 'edit') {
        return `Edit ${personCardActions.member?.first_name} ${personCardActions.member?.middle_name} ${personCardActions.member?.last_name}`;
      } else {
        return 'Add New Member';
      }
    };
    return (
      <>
        {personCardActions.cardActions && (
          <ModalDialog open={personCardActions.isModalOpen} onClose={personCardActions.cardActions.onClose!} title={modalTitle()}>
            <MemberForm
              member={personCardActions.member!}
              onClose={personCardActions.cardActions.onClose!}
              onSuccess={() => {
                personCardActions.cardActions.onSuccess!();
                refreshFamilyData();
              }}
              focussedMemberId={personCardActions.focusedMemberId}
              relationType={personCardActions.modalMode?.relationType ?? null}
              operationType={personCardActions.modalMode?.operationType ?? ''}
            />
          </ModalDialog>
        )}
      </>
    );
  };

  return (
    <>
      <div>
        <button
          className="bg-accent-primary text-background-primary font-semibold text-xl px-4 py-2 rounded-xl hover:bg-accent-secondary transition duration-150"
          onClick={handleGlobalAdd}
        >
          <span className="flex items-center gap-2">
            <PlusIcon className="h-6 w-6" />
            <p>Add Member</p>
          </span>
        </button>
      </div>
      {AddMember_Modal()}
    </>
  );
}

export default AddMember;
