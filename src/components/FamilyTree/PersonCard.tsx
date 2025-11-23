import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import type { TreeNode } from "../../models/SupabaseDataModel";

interface CardActionProps {
  onSelect: (memberId: string) => void;
  onEdit: (memberId: string) => void;
  onAdd: (memberId: string) => void;
  focusedMemberId: string | null;
}

interface PersonCardProps extends CardActionProps {
  member: TreeNode;
}

export const PersonCard = ({ member, onSelect, onEdit, onAdd, focusedMemberId }: PersonCardProps) => {
  const memberId = member.member_id;
  const isFocused = focusedMemberId === memberId;

  const getFullName = () => {
    return [member.first_name, member.middle_name, member.last_name].filter(Boolean).join(" ");
  };

  const getLifeSpan = () => {
    const birthYear = new Date(member.birth_date).getFullYear();
    const deathYear = member.death_date ? new Date(member.death_date).getFullYear() : "";
    return `(${birthYear} - ${deathYear})`;
  };

  const primarySpouse = member.spouses.length > 0 ? member.spouses[0] : null;
  const spouseName = primarySpouse
    ? [primarySpouse.first_name, primarySpouse.middle_name, primarySpouse.last_name].filter(Boolean).join(" ")
    : "N/A";

  const actionButtons = () => {
    return (
      <>
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(memberId);
            }}
            className="p-1 hover:bg-background-primary rounded-full"
            title="Edit Member Details"
          >
            <PencilIcon className="h-5 w-5 text-text-secondary" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(memberId);
            }}
            className="p-1 hover:bg-background-primary rounded-full"
          >
            <UserPlusIcon className="h-5 w-5 text-text-secondary" />
          </button>
        </div>
      </>
    );
  };

  const imageAndName = () => {
    return (
      <>
        <div className="flex items-center gap-4 mb-4">
          {/* Profile Picture */}
          {/* <div className="w-24 h-24 bg-background-primary rounded-full shrink-0"></div> */}
          {/* Use member.profile_picture_url if available, fallback to placeholder */}
          <div
            className={`w-24 h-24 bg-background-primary rounded-full shrink-0 
            flex items-center justify-center text-4xl text-text-primary font-bold overflow-hidden
            ${isFocused ? "border-6 border-accent-primary" : ""}`}
          >
            {member.profile_picture_url ? (
              <img src={member.profile_picture_url} alt={member.first_name} className="w-full h-full object-cover" />
            ) : (
              getFullName().charAt(0) // Display first initial as placeholder
            )}
          </div>
          {/* Name and Lifespan */}
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-text-primary">{getFullName()}</h2>
            <p className="text-text-secondary">{getLifeSpan()}</p>
          </div>
        </div>
      </>
    );
  };

  const additionalDetails = () => {
    return (
      <>
        <div className="border-t bg-background-secondary pt-4 space-y-2">
          {/* {(spouseName != "N/A") && ( */}
            <>
              {/* Display Spouse */}
              <div>
                <span className="font-semibold text-text-primary">Spouse: </span>
                <span className="text-text-secondary">{spouseName || "N/A"}</span>
              </div>
            </>
          {/* )} */}
          {/* Display Profession */}
          <div>
            <span className="font-semibold text-text-primary">Profession: </span>
            <span className="text-text-secondary">{member.profession || "N/A"}</span>
          </div>
          {/* Display Birth Place */}
          <div>
            <span className="font-semibold text-text-primary">Born: </span>
            <span className="text-text-secondary">{member.birth_place || "N/A"}</span>
          </div>
          <div className="hidden">
            <span className="font-semibold text-text-primary">Notes: </span>
            <span className="text-text-secondary italic">{member.notes || ""}</span>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div
        onClick={() => onSelect(memberId)}
        className={`bg-background-secondary p-4 rounded-lg shadow-md border w-100 relative
          ${(member.spouses.length === 0 && member.children.length === 0) ? 'h-80' : 'h-80'}
          `}
      >
        {/* Action buttons top right */}
        {actionButtons()}

        {/* Top section: Image and Name */}
        {imageAndName()}

        {/* Bottom section: Additional Details */}
        {additionalDetails()}
      </div>
    </>
  );
};
