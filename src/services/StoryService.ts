import { StoryAPI } from "../api/story_api";
import type { Story } from "../models/SupabaseDataModel";

const getAllStories = async (): Promise<Story[]> => {
    try {
        const stories = await StoryAPI.getAllStories();
        return stories;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getStoryById = async (id: string): Promise<Story | null> => {
    try {
        const story = await StoryAPI.getStoryById(id);
        return story;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const insertStory = async (story: Story): Promise<Story> => {
    try {
        const newStory = await StoryAPI.createStory(story);
        return newStory;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const updateStory = async (story: Story): Promise<Story> => {
    try {
        const updatedStory = await StoryAPI.updateStory(story);
        return updatedStory;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const deleteStory = async (id: string): Promise<void> => {
    try {
        await StoryAPI.deleteStory(id);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const StoryService = {
    getAllStories,
    getStoryById,
    insertStory,
    updateStory,
    deleteStory,
}