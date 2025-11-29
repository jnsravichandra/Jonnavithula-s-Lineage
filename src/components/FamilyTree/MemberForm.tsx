import { useEffect, useState } from "react";
import type { Member } from "../../models/SupabaseDataModel";
import { MemberService } from "../../services/MemberService";
import toast from "react-hot-toast";
import Label from "../UI/Label";

const initialFormState: Partial<Member> = {
  first_name: "",
  middle_name: "",
  last_name: "",
  gender: "Male",
  birth_date: new Date(), // Default to today's date
  death_date: null, // Default to null
  birth_place: "",
  profession: "",
  notes: "",
  profile_picture_url: "",
  member_id: "",
};

interface MemberFormProps {
  member: Member | null;
  onSuccess: () => void;
  onClose: () => void;
  contextMemberId: string | null;
}

export const MemberForm = ({ member, onSuccess, onClose }: MemberFormProps) => {
  const isEditing = !!member;
  const [formData, setFormData] = useState<Partial<Member>>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && member) {
      setFormData({
        ...member,
        birth_date: member.birth_date
          ? new Date(member.birth_date)
          : new Date(),
        death_date: member.death_date ? new Date(member.death_date) : null,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [member, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (e.target.type === "date") {
      setFormData((prev: Partial<Member>) => ({
        ...prev,
        [name]: new Date(value).toISOString(),
      }));
    } else {
      setFormData((prev: Partial<Member>) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isEditing && member) {
        // --- UPDATE (Edit) LOGIC ---
        const updatedMember: Member = {
          ...formData,
          member_id: member.member_id, // Ensure member_id is included
          created_at: member.created_at, // Preserve original creation date
        } as Member; // Cast to Member, assuming required fields are filled

        await MemberService.updateMember(updatedMember);
      } else {
        // --- CREATE (Add) LOGIC ---
        const newMember: Partial<Member> = {
          ...formData,
          created_at: new Date(), // Set new creation date
        };

        // Remove member_id if it exists (Supabase auto-generates it)
        delete newMember.member_id;

        // TODO: Add logic to use 'contextMemberId' to create a relationship
        // (e.g., call DescendantLinkageService.createLink(contextMemberId, newMemberId))
        // This logic needs to be implemented after the member is successfully created.

        await MemberService.insertMember(newMember as Member);
      }

      // If successful, trigger the onSuccess callback (closes modal, refreshes data)
      onSuccess();
    } catch (error) {
      console.error("Failed to save member:", (error as Error).message);

      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateForInput = (date: Date | null) => {
    if (!date) return "";
    try {
      return new Date(date).toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const formTextInput = (
    name: string,
    id: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => {
    return (
      <input
        type="text"
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        className="mt-sm h-2xl p-sm text-2xl block w-full rounded-md border border-text-secondary shadow-sm focus:border-accent-primary focus:ring-accent-primary"
        required
      />
    );
  };

  const formDateInput = (
    name: string,
    id: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => {
    return (
      <>
        <input
          type="date"
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          className="mt-sm p-sm h-2xl text-2xl block w-full rounded-md border border-text-secondary  shadow-sm focus:border-accent-primary focus:ring-accent-primary"
        />
      </>
    );
  };

  const formDropdownInput = (
    name: string,
    id: string,
    value: string,
    onChange: (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => void,
    options: { label: string; value: string }[]
  ) => {
    return (
      <>
        <select
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          className="mt-sm p-sm h-2xl text-2xl block w-full rounded-md border border-text-secondary shadow-sm focus:border-accent-primary focus:ring-accent-primary"
        >
          {options.map((option) => (
            <option
              className="bg-background-secondary"
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </>
    );
  };

  const formTextAreaInput = (
    name: string,
    id: string,
    value: string,
    rows: number,
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  ) => {
    return (
      <>
        <textarea
          name={name}
          id={id}
          rows={rows}
          value={value}
          onChange={onChange}
          className="mt-sm p-sm h-2xl text-2xl block w-full rounded-md border border-text-secondary  shadow-sm focus:border-accent-primary focus:ring-accent-primary"
        />
      </>
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* --- Form Fields --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-150 overflow-y-auto p-2">
          {/* First Name */}
          <div>
            <Label
              htmlFor="first_name"
              labelText="First Name"
              className="block text-lg font-bold text-text-secondary"
            />
            {formTextInput(
              "first_name",
              "first_name",
              formData.first_name!,
              handleChange
            )}
          </div>

          {/* Middle Name */}
          <div>
            <Label
              htmlFor="middle_name"
              labelText="Middle Name"
              className="block text-lg font-bold text-text-secondary"
            />
            {formTextInput(
              "middle_name",
              "middle_name",
              formData.middle_name!,
              handleChange
            )}
          </div>

          {/* Last Name */}
          <div>
            <Label
              htmlFor="last_name"
              labelText="Last Name"
              className="block text-lg font-bold text-text-secondary"
            />
            {formTextInput(
              "last_name",
              "last_name",
              formData.last_name!,
              handleChange
            )}
          </div>

          {/* Gender */}
          <div>
            <Label
              htmlFor="gender"
              labelText="Gender"
              className="block text-lg font-bold text-text-secondary"
            />
            {formDropdownInput(
              "gender",
              "gender",
              formData.gender!,
              handleChange,
              [
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
                { label: "Other", value: "Other" },
              ]
            )}
          </div>

          {/* Birth Date */}
          <div>
            <Label
              htmlFor="birth_date"
              labelText="Birth Date"
              className="block text-lg font-bold text-text-secondary"
            />
            {formDateInput(
              "birth_date",
              "birth_date",
              formatDateForInput(formData.birth_date!),
              handleChange
            )}
          </div>

          {/* Death Date */}
          <div>
            <Label
              htmlFor="death_date"
              labelText="Death Date"
              className="block text-lg font-bold text-text-secondary"
            />
            {formDateInput(
              "death_date",
              "death_date",
              formatDateForInput(formData.death_date!),
              handleChange
            )}
          </div>

          {/* Birth Place */}
          <div>
            <Label
              htmlFor="birth_place"
              labelText="Birth Place"
              className="block text-lg font-bold text-text-secondary"
            />
            {formTextInput(
              "birth_place",
              "birth_place",
              formData.birth_place!,
              handleChange
            )}
          </div>

          {/* Death Place */}
          <div>
            <Label
              htmlFor="death_place"
              labelText="Death Place"
              className="block text-lg font-bold text-text-secondary"
            />
            {formTextInput(
              "death_place",
              "death_place",
              formData.death_place!,
              handleChange
            )}
          </div>

          {/* Profession */}
          <div>
            <Label
              htmlFor="profession"
              labelText="Profession"
              className="block text-lg font-bold text-text-secondary"
            />
            {formTextInput(
              "profession",
              "profession",
              formData.profession!,
              handleChange
            )}
          </div>

          {/* Religion */}
          <div>
            <Label
              htmlFor="religion"
              labelText="Religion"
              className="block text-lg font-bold text-text-secondary"
            />
            {formTextInput(
              "religion",
              "religion",
              formData.religion!,
              handleChange
            )}
          </div>

          {/* Profile Picture URL */}
          <div className="md:col-span-2">
            <Label
              htmlFor="profile_picture_url"
              labelText="Profile Picture URL"
              className="block text-lg font-bold text-text-secondary"
            />
            {formTextInput(
              "profile_picture_url",
              "profile_picture_url",
              formData.profile_picture_url!,
              handleChange
            )}
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <Label
              htmlFor="notes"
              labelText="Notes"
              className="block text-lg font-bold text-text-secondary"
            />
            {formTextAreaInput(
              "notes",
              "notes",
              formData.notes!,
              3,
              handleChange
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 bg-red-100 border border-red-400 p-3 rounded-md">
            {toast.error(error)}
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* --- Form Actions (Footer) --- */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="py-2 px-4 bg-accent-primary text-background-primary rounded-md hover:bg-accent-secondary transition disabled:opacity-50"
          >
            {isLoading
              ? "Saving..."
              : isEditing
              ? "Save Changes"
              : "Create Member"}
          </button>
        </div>
      </form>
    </>
  );
};
