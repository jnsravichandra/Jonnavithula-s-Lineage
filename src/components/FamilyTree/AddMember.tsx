import { PlusIcon } from "@heroicons/react/24/solid";
import { type PersonCardActionType } from "../../hooks/usePersonCardActions";
import { ModalDialog } from "../shared/ModalDialogComponent";
import { MemberForm } from "./MemberForm";

interface AddMemberProps {
  onMemberAdded: () => void;
  personCardActions: PersonCardActionType;
}

function AddMember({ onMemberAdded, personCardActions }: AddMemberProps) {
  const handleGlobalAdd = () => {
    personCardActions.cardActions?.onAdd("");
  };
  const AddMember_Global = () => {
    return (
      <>
        {personCardActions.cardActions?.onClose && (
          <ModalDialog
            open={personCardActions.isModalOpen}
            onClose={personCardActions.cardActions.onClose!}
            title={
              personCardActions.member
                ? `Edit ${personCardActions.member.first_name} ${personCardActions.member.middle_name} ${personCardActions.member.last_name} Details`
                : "Add New Member"
            }
          >
            <MemberForm
              member={personCardActions.member!}
              onClose={personCardActions.cardActions.onClose!}
              onSuccess={() => {
                personCardActions.cardActions.onSuccess!();
                onMemberAdded();
              }}
              contextMemberId={personCardActions.focusedMemberId}
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
      {AddMember_Global()}
    </>
  );
}

export default AddMember;
