import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { ModalDialog } from "./ModalDialogComponent";

export const AddMember = () => {
  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);

  const toggleAddMemberModal = () => {
    setOpenAddMemberModal(!openAddMemberModal);
  };

  return (
    <>
      <div className="flex justify-end relative">
        <button
          className="bg-accent-primary text-background-primary font-semibold text-xl p-sm rounded-xl"
          onClick={toggleAddMemberModal}
        >
          <span className="flex items-center gap-2">
            <PlusIcon className="h-10 w-10"></PlusIcon>
            <p>Add Member</p>
          </span>
        </button>
      </div>
      <ModalDialog open={openAddMemberModal} onClose={toggleAddMemberModal} title="Add Member">
        <div></div>
      </ModalDialog>
    </>
  );
};
