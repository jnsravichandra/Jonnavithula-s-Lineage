export interface Member {
  member_id?: string;
  created_at: Date;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  birth_date: Date;
  death_date: Date | null;
  birth_place: string;
  death_place: string | null;
  profession: string;
  religion: string;
  notes: string;
  profile_picture_url: string;
}

export interface DescendantLinkage {
  parent_child_id: string;
  parent_a_id: string;
  parent_b_id: string;
  child_id: string;
  created_at: Date;
  relationship_type: string;
  date_established: Date;
  date_terminated: Date | null;
  notes: string;
}

export interface Spouse {
  spouse_id: string;
  created_at: Date;
  member_a_id: string;
  member_b_id: string;
  relationship_status: string;
  start_date: Date;
  end_date: Date | null;
  location: string;
  notes: string;
}

export interface Story {
  id: string;
  created_at: Date;
  title: string;
  content: string;
  author_id: string;
}

export interface TreeNode {
  member_id: string;
  created_at: Date;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  birth_date: Date;
  death_date: Date | null;
  birth_place: string;
  death_place: string | null;
  profession: string;
  religion: string;
  notes: string;
  profile_picture_url: string;

  spouses: TreeNode[];
  children: TreeNode[];

  isRoot?: boolean; // True if this person has no recorded parents
}
