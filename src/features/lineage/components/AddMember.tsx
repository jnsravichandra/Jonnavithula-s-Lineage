import { PlusIcon } from '@heroicons/react/24/solid';

export interface AddMemberProps {
  onAdd: (memberId?: string, event?: React.MouseEvent) => void;
}

function AddMember({ onAdd }: AddMemberProps) {
 
  return (
    <>
      <div>
        <button
          className="bg-accent-primary text-background-primary font-semibold text-xl px-4 py-2 rounded-xl hover:bg-accent-secondary transition duration-150"
          onClick={() => onAdd('')}
        >
          <span className="flex items-center gap-2">
            <PlusIcon className="h-6 w-6" />
            <p>Add Member</p>
          </span>
        </button>
      </div>
    </>
  );
}

export default AddMember;
