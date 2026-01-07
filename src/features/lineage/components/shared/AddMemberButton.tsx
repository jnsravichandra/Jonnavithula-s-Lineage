import { PlusIcon } from '@heroicons/react/24/solid';

export interface AddMemberProps {
  onAdd: (memberId?: string, event?: React.MouseEvent) => void;
}

function AddMemberButton({ onAdd }: AddMemberProps) {
  return (
    <>
      <div>
        <button
          className={`bg-action-primary text-background-primary font-semibold text-lg px-4 py-2 rounded-xl 
            hover:text-text-primary hover:bg-action-secondary 
            transition duration-300`}
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

export default AddMemberButton;
