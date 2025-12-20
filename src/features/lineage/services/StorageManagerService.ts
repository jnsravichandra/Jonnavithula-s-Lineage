import * as StorageApi from '../api/storage_manager_api';

// Replace 'members_assets' with the actual name of your Supabase storage bucket
const BUCKET_NAME = 'members_assets';

export const StorageManagerService = {
  uploadProfilePicture: async (file: File): Promise<string> => {
    try {
      // Create a unique file path: profile_pictures/timestamp_filename
      // Sanitize the filename to remove spaces or special characters
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const filePath = `profile_pictures/${Date.now()}_${sanitizedFileName}`;
      await StorageApi.uploadFile(BUCKET_NAME, filePath, file);
      
      return StorageApi.getPublicUrl(BUCKET_NAME, filePath);
    } catch (error) {
      console.error('Error in StorageManagerService.uploadProfilePicture:', error);
      throw error;
    }
  },
};
