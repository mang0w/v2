import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth, db, storage } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface CartItem {
  name: string;
  price: number;
  flavor: string;
  quantity: number;
}

interface Visit {
  date: string;
  points: number;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  points: number;
  birthday: string;
  profilePicture: string | null;
  tier: 'Bronze' | 'Argent' | 'Or' | 'Platine' | 'Diamant';
  progress: number;
  nextReward: number;
  visits: Visit[];
}

interface Store {
  user: User | null;
  theme: 'light' | 'dark';
  cart: CartItem[];
  cartCount: number;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string, birthday: string) => Promise<void>;
  logout: () => Promise<void>;
  addPoints: (points: number) => Promise<void>;
  toggleTheme: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  updateUserInfo: (firstName: string, lastName: string, email: string) => Promise<void>;
  updateProfilePicture: (imageFile: File) => Promise<void>;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: null,
      theme: 'light',
      cart: [],
      cartCount: 0,
      login: async (email, password) => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
          const userData = userDoc.data() as Omit<User, 'id'>;
          set({ user: { ...userData, id: userCredential.user.uid } });
        } catch (error) {
          console.error('Erreur de connexion:', error);
          throw error;
        }
      },
      register: async (firstName, lastName, email, password, birthday) => {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user: Omit<User, 'id'> = {
            firstName,
            lastName,
            email,
            points: 0,
            birthday,
            profilePicture: null,
            tier: 'Bronze',
            progress: 0,
            nextReward: 50,
            visits: [],
          };

          await setDoc(doc(db, 'users', userCredential.user.uid), {
            ...user,
            createdAt: serverTimestamp(),
          });

          await updateProfile(userCredential.user, {
            displayName: `${firstName} ${lastName}`,
          });

          set({ user: { ...user, id: userCredential.user.uid } });
        } catch (error) {
          console.error('Erreur d\'inscription:', error);
          throw error;
        }
      },
      logout: async () => {
        try {
          await signOut(auth);
          set({ user: null });
        } catch (error) {
          console.error('Erreur de déconnexion:', error);
          throw error;
        }
      },
      addPoints: async (points) => {
        const { user } = get();
        if (!user || !auth.currentUser) return;

        try {
          const newPoints = user.points + points;
          let tier = user.tier;
          
          if (newPoints >= 2500) tier = 'Diamant';
          else if (newPoints >= 1000) tier = 'Platine';
          else if (newPoints >= 500) tier = 'Or';
          else if (newPoints >= 200) tier = 'Argent';

          const newVisit = {
            date: new Date().toISOString().split('T')[0],
            points,
          };

          const updatedUser = {
            ...user,
            points: newPoints,
            tier,
            visits: [newVisit, ...user.visits],
          };

          await updateDoc(doc(db, 'users', user.id), updatedUser);
          set({ user: updatedUser });
        } catch (error) {
          console.error('Erreur d\'ajout de points:', error);
          throw error;
        }
      },
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
          return { theme: newTheme };
        });
      },
      addToCart: (item) => {
        set((state) => ({
          cart: [...state.cart, item],
          cartCount: state.cartCount + item.quantity
        }));
      },
      removeFromCart: (index) => {
        set((state) => ({
          cart: state.cart.filter((_, i) => i !== index),
          cartCount: state.cartCount - state.cart[index].quantity
        }));
      },
      clearCart: () => {
        set({ cart: [], cartCount: 0 });
      },
      updateUserInfo: async (firstName, lastName, email) => {
        const { user } = get();
        if (!user || !auth.currentUser) return;

        try {
          const updatedUser = {
            ...user,
            firstName,
            lastName,
            email,
          };

          await updateDoc(doc(db, 'users', user.id), {
            firstName,
            lastName,
            email,
          });

          await updateProfile(auth.currentUser, {
            displayName: `${firstName} ${lastName}`,
          });

          set({ user: updatedUser });
        } catch (error) {
          console.error('Erreur de mise à jour:', error);
          throw error;
        }
      },
      updateProfilePicture: async (imageFile) => {
        const { user } = get();
        if (!user || !auth.currentUser) return;

        try {
          const storageRef = ref(storage, `profiles/${user.id}`);
          await uploadBytes(storageRef, imageFile);
          const downloadURL = await getDownloadURL(storageRef);

          await updateDoc(doc(db, 'users', user.id), {
            profilePicture: downloadURL,
          });

          await updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          });

          set({ user: { ...user, profilePicture: downloadURL } });
        } catch (error) {
          console.error('Erreur de mise à jour de la photo:', error);
          throw error;
        }
      },
    }),
    {
      name: 'angelo-store',
    }
  )
);

// Écouteur d'authentification Firebase
auth.onAuthStateChanged(async (firebaseUser) => {
  if (firebaseUser) {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (userDoc.exists()) {
      useStore.setState({ 
        user: { 
          id: firebaseUser.uid,
          ...userDoc.data() as Omit<User, 'id'>
        } 
      });
    }
  } else {
    useStore.setState({ user: null });
  }
});