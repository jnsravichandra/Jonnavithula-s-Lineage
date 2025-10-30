/**
 * Defines the shape of a member object, matching the columns in your 'member' table.
 * This interface serves as the single source of truth for the member data structure.
 */
export interface Member {
  member_id?: string;
  created_at: Date;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  birth_date: Date;
  death_date: Date;
  birth_place: string;
  death_place: string;
  occupation: string;
  religion: string;
  notes: string;
  profile_picture_url: string;
}
