import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';
import type { User } from '../../types';

export const createUserDocument = async (uid: string, userData: Omit<User, 'id'>) => {
  try {
    await setDoc(doc(db, 'users', uid), {
      ...userData,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Erreur lors de la création du document utilisateur:', error);
    throw error;
  }
};

export const getUserDocument = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du document utilisateur:', error);
    throw error;
  }
};

export const updateUserDocument = async (uid: string, data: Partial<User>) => {
  try {
    await updateDoc(doc(db, 'users', uid), data);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du document utilisateur:', error);
    throw error;
  }
};