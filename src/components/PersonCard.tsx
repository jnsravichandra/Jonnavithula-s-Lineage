import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import type { Member } from "../models/SupabaseDataModel";

interface PersonCardProps {
  person: Member;
}

export const PersonCard = ({ person }: PersonCardProps) => {
  const getFullName = () => {
    return [person.first_name, person.middle_name, person.last_name].filter(Boolean).join(" ");
  };

  const getLifeSpan = () => {
    const birthYear = new Date(person.birth_date).getFullYear();
    const deathYear = person.death_date ? new Date(person.death_date).getFullYear() : "";
    return `(${birthYear} - ${deathYear})`;
  };

  return (
    <div className="bg-background-secondary p-4 rounded-lg shadow-md border border-gray-700 w-96 relative">
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
      <div className="border-t border-gray-700 pt-4 space-y-2">
        <div>
          <span className="font-semibold text-text-primary">Spouse: </span>
          {/* <span className="text-text-secondary">{person.spouse_name || "N/A"}</span> */}
          <span className="text-text-secondary">Spouse Name</span>
        </div>
        <div>
          <span className="font-semibold text-text-primary">Profession: </span>
          <span className="text-text-secondary">{person.profession || "N/A"}</span>
        </div>
        <p className="text-text-secondary italic">{person.notes || ""}</p>
      </div>
    </div>
  );
};
