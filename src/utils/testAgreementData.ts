import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Utility functions for testing the agreement viewer and signature workflow
 * These functions are meant to be used in development only
 */

/**
 * Creates a test agreement for the current user
 * @param userId The ID of the user to create the agreement for
 * @returns The ID of the created agreement
 */
export async function createTestAgreement(userId: string) {
  try {
    // Sample PDF file URL (this is a placeholder - in production you'd upload a real PDF)
    const samplePdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    
    // Fetch the sample PDF
    const response = await fetch(samplePdfUrl);
    const pdfBlob = await response.blob();
    
    // Generate a unique file path
    const fileName = `Test Agreement ${new Date().toLocaleDateString()}.pdf`;
    const filePath = `${userId}/agreements/${uuidv4()}.pdf`;
    
    // Upload the PDF to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('agreements')
      .upload(filePath, pdfBlob, {
        contentType: 'application/pdf',
        upsert: true
      });
    
    if (uploadError) throw uploadError;
    
    // Create an agreement record in the database
    const { data: agreementData, error: agreementError } = await supabase
      .from('agreements')
      .insert({
        user_id: userId,
        file_name: fileName,
        file_path: filePath,
        file_size: pdfBlob.size,
        mime_type: 'application/pdf',
        status: 'active'
      })
      .select()
      .single();
    
    if (agreementError) throw agreementError;
    
    return agreementData.id;
  } catch (error: any) {
    console.error('Error creating test agreement:', error.message);
    throw error;
  }
}

/**
 * Lists all agreements for the current user
 * @param userId The ID of the user to list agreements for
 * @returns Array of agreement objects
 */
export async function listUserAgreements(userId: string) {
  try {
    const { data, error } = await supabase
      .from('agreements')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error('Error listing agreements:', error.message);
    throw error;
  }
}

/**
 * Deletes a test agreement
 * @param agreementId The ID of the agreement to delete
 */
export async function deleteTestAgreement(agreementId: string) {
  try {
    // First get the agreement to find the file path
    const { data: agreement, error: getError } = await supabase
      .from('agreements')
      .select('file_path')
      .eq('id', agreementId)
      .single();
    
    if (getError) throw getError;
    
    // Delete the agreement record
    const { error: deleteError } = await supabase
      .from('agreements')
      .delete()
      .eq('id', agreementId);
    
    if (deleteError) throw deleteError;
    
    // Delete the file from storage
    if (agreement?.file_path) {
      await supabase.storage
        .from('agreements')
        .remove([agreement.file_path]);
    }
    
    return true;
  } catch (error: any) {
    console.error('Error deleting test agreement:', error.message);
    throw error;
  }
}
