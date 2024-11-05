import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { auth } from './config';
import { createUserDocument } from './firestore';

export const signUp = async (
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string,
  birthday: string
) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    });
    await createUserDocument(user.uid, {
      firstName,
      lastName,
      email,
      birthday,
      points: 0,
      profilePicture: null,
      tier: 'Bronze',
      progress: 0,
      nextReward: 50,
      visits: []
    });
    return user;
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    throw error;
  }
};