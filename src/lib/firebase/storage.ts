import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

export const uploadProfilePicture = async (uid: string, file: File) => {
  try {
    const storageRef = ref(storage, `profiles/${uid}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image:', error);
    throw error;
  }
};