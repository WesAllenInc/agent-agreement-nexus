import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads a file to the Supabase storage 'attachments' bucket
 * 
 * @param path - The path where the file will be stored in the bucket
 * @param file - The file to upload
 * @returns Object containing the URL of the uploaded file or an error
 */
export async function uploadFile(path: string, file: File) {
  const { data, error } = await supabase.storage.from('attachments').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  
  return { url: data?.path ? getFileUrl('attachments', data.path) : undefined, error };
}

/**
 * Generates a public URL for a file in Supabase storage
 * 
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 * @returns The public URL for the file
 */
export function getFileUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Removes a file from Supabase storage
 * 
 * @param bucket - The storage bucket name
 * @param path - The file path to remove
 * @returns Object containing success status or an error
 */
export async function removeFile(bucket: string, path: string) {
  const { data, error } = await supabase.storage.from(bucket).remove([path]);
  return { success: data && data.length > 0, error };
}

/**
 * Generates a unique file path for upload
 * 
 * @param fileName - The original file name
 * @returns A unique file path with timestamp prefix
 */
export function generateFilePath(fileName: string): string {
  return `${Date.now()}_${fileName.replace(/\s+/g, '_')}`;
}
