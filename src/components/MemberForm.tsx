import { useEffect, useState } from "react";
import type { Member } from "../models/SupabaseDataModel";
import { MemberService } from "../services/MemberService";

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
  contextMemberId: string | null;
  onSuccess: () => void;
  onClose: () => void;
}

export const MemberForm = ({ member, contextMemberId, onSuccess, onClose }: MemberFormProps) => {
  const isEditing = !!member;
    // console.log(contextMemberId);
  const [formData, setFormData] = useState<Partial<Member>>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && member) {
      setFormData({
        ...member,
        birth_date: member.birth_date ? new Date(member.birth_date) : new Date(),
        death_date: member.death_date ? new Date(member.death_date) : null,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [member, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (e.target.type === "date") {
      setFormData((prev: Partial<Member>) => ({ ...prev, [name]: new Date(value).toISOString() }));
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

  return (<>
  <form onSubmit={handleSubmit} className="space-y-4">
    {/* Form Title */}
            {/* <h2 className="text-2xl font-bold text-text-primary">
                {isEditing ? "Edit Member" : "Add New Member"}
            </h2> */}
            {contextMemberId}

            {/* --- Form Fields --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
                
                {/* First Name */}
                <div>
                    <label htmlFor="first_name" className="block text-sm font-bold text-text-secondary">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-text-secondary shadow-sm focus:border-accent-primary focus:ring-accent-primary"
                        required
                    />
                </div>

                {/* Middle Name */}
                <div>
                    <label htmlFor="middle_name" className="block text-sm font-bold text-text-secondary">Middle Name</label>
                    <input
                        type="text"
                        name="middle_name"
                        id="middle_name"
                        value={formData.middle_name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-primary focus:ring-accent-primary"
                    />
                </div>

                {/* Last Name */}
                <div>
                    <label htmlFor="last_name" className="block text-sm font-bold text-text-secondary">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-primary focus:ring-accent-primary"
                        required
                    />
                </div>

                {/* Gender */}
                <div>
                    <label htmlFor="gender" className="block text-sm font-bold text-text-secondary">Gender</label>
                    <select
                        name="gender"
                        id="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-primary focus:ring-accent-primary"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Birth Date */}
                <div>
                    <label htmlFor="birth_date" className="block text-sm font-bold text-text-secondary">Birth Date</label>
                    <input
                        type="date"
                        name="birth_date"
                        id="birth_date"
                        value={formatDateForInput(formData.birth_date!)}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-primary focus:ring-accent-primary"
                    />
                </div>

                {/* Death Date */}
                <div>
                    <label htmlFor="death_date" className="block text-sm font-bold text-text-secondary">Death Date (if applicable)</label>
                    <input
                        type="date"
                        name="death_date"
                        id="death_date"
                        value={formatDateForInput(formData.death_date!)}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-primary focus:ring-accent-primary"
                    />
                </div>

                {/* Birth Place */}
                <div>
                    <label htmlFor="birth_place" className="block text-sm font-bold text-text-secondary">Birth Place</label>
                    <input
                        type="text"
                        name="birth_place"
                        id="birth_place"
                        value={formData.birth_place}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-primary focus:ring-accent-primary"
                    />
                </div>

                {/* Death Place */}
                <div>
                    <label htmlFor="death_place" className="block text-sm font-bold text-text-secondary">Death Place</label>
                    <input
                        type="text"
                        name="death_place"
                        id="death_place"
                        value={formData.death_place || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-primary focus:ring-accent-primary"
                    />
                </div>

                {/* Profession */}
                <div>
                    <label htmlFor="profession" className="block text-sm font-bold text-text-secondary">Profession</label>
                    <input
                        type="text"
                        name="profession"
                        id="profession"
                        value={formData.profession}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-primary focus:ring-accent-primary"
                    />
                </div>

                {/* Religion */}
                <div>
                    <label htmlFor="religion" className="block text-sm font-bold text-text-secondary">Religion</label>
                    <input
                        type="text"
                        name="religion"
                        id="religion"
                        value={formData.religion}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-primary focus:ring-accent-primary"
                    />
                </div>

                {/* Profile Picture URL */}
                <div className="md:col-span-2">
                    <label htmlFor="profile_picture_url" className="block text-sm font-bold text-text-secondary">Profile Picture URL</label>
                    <input
                        type="text"
                        name="profile_picture_url"
                        id="profile_picture_url"
                        value={formData.profile_picture_url}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-primary focus:ring-accent-primary"
                    />
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-bold text-text-secondary">Notes</label>
                    <textarea
                        name="notes"
                        id="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-primary focus:ring-accent-primary"
                    />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="text-red-600 bg-red-100 border border-red-400 p-3 rounded-md">
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
                    {isLoading ? "Saving..." : (isEditing ? "Save Changes" : "Create Member")}
                </button>
            </div>
</form>
  </>)

};
