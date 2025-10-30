import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export const SupabaseTables = {
    "Member": "Member",
    "Spouse": "Spouse",
    "Story": "Story",
    "DescendantLinkage": "Descendant Linkage",
}

// console.log(supabase);

export default supabase