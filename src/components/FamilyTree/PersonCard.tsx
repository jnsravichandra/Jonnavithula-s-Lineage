import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import type { TreeNode } from "../../models/SupabaseDataModel";

interface PersonCardProps {
  member: TreeNode;
}

export const PersonCard = ({ member }: PersonCardProps) => {
 
  const getFullName = () => {
    return [member.first_name, member.middle_name, member.last_name].filter(Boolean).join(" ");
  };

  const getLifeSpan = () => {
    const birthYear = new Date(member.birth_date).getFullYear();
    const deathYear = member.death_date ? new Date(member.death_date).getFullYear() : "";
    return `(${birthYear} - ${deathYear})`;
  };

  const primarySpouse = member.spouses.length > 0 ? member.spouses[0] : null;
  const spouseName = primarySpouse ? [primarySpouse.first_name, primarySpouse.middle_name, primarySpouse.last_name].filter(Boolean).join(" ") : "N/A";

  return (
    <div className={`bg-background-secondary p-4 rounded-lg shadow-md border w-100 relative h-80`}>
      {/* Action buttons top right */}
      <div className="absolute top-2 right-2 flex gap-2">
        <button className="p-1 hover:bg-background-primary rounded-full">
          <PencilIcon className="h-5 w-5 text-text-secondary" />
        </button>
        <button className="p-1 hover:bg-background-primary rounded-full">
          <UserPlusIcon className="h-5 w-5 text-text-secondary" />
        </button>
      </div>

      {/* Top section: Image and Name */}
      <div className="flex items-center gap-4 mb-4">
        {/* Profile Picture */}
        <div className="w-24 h-24 bg-background-primary rounded-full shrink-0"></div>

        {/* Name and Lifespan */}
        <div className="mt-4">
          <h2 className="text-2xl font-bold text-text-primary">{getFullName()}</h2>
          <p className="text-text-secondary">{getLifeSpan()}</p>
        </div>
      </div>

      {/* Bottom section: Additional Details */}
      <div className="border-t bg-background-secondary pt-4 space-y-2">
        <div>
          <span className="font-semibold text-text-primary">Spouse: </span>
          <span className="text-text-secondary">{spouseName || "N/A"}</span>
        </div>
        <div>
          <span className="font-semibold text-text-primary">Profession: </span>
          <span className="text-text-secondary">{member.profession || "N/A"}</span>
        </div>
        <div>
          <span className="font-semibold text-text-primary">Notes: </span>
          <span className="text-text-secondary italic">{member.notes || ""}</span>
        </div>
      </div>
    </div>
  );
};
