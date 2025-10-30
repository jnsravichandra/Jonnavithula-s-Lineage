import type { Story } from "../models/SupabaseDataModel";
import supabase, { SupabaseTables } from "../context/SupabaseClient";

const getAllStories = async (): Promise<Story[]> => {
    const { data, error } = await supabase.from(SupabaseTables.Story).select("*");
    if (error) {
        console.log(error);
        throw error;
    }
    return data || [];
}

const getStoryById = async (id: string): Promise<Story> => {
    const { data, error } = await supabase.from(SupabaseTables.Story).select("*").eq("id", id).single();
    if (error) {
        console.log(error);
        throw error;
    }
    return data || ({} as Story);
}

const createStory = async (story: Story): Promise<Story> => {
    const { data, error } = await supabase.from(SupabaseTables.Story).insert(story).single();
    if(error) {
        console.log(error);
        throw error;
    }
    return data || ({} as Story);
}

const updateStory = async (story: Story): Promise<Story> => {
    const { data, error } = await supabase.from(SupabaseTables.Story).update(story).eq("id", story.id).single();
    if(error) {
        console.log(error);
        throw error;
    }
    return data || ({} as Story);
}

const deleteStory = async (id: string): Promise<void> => {
    const { error } = await supabase.from(SupabaseTables.Story).delete().eq("id", id);
    if(error) {
        console.log(error);
        throw error;
    }
}

export const StoryAPI = {
    getAllStories,
    getStoryById,
    createStory,
    updateStory,
    deleteStory,
}