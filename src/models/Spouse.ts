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