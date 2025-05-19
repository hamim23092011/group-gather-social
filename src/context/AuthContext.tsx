
import { createContext, useContext, useEffect, useState } from "react";
import { 
  GoogleAuthProvider, 
  User, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  updateProfile 
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, photoURL: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string, photoURL: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + name
        });
        
        // Force refresh the user to get updated profile
        setCurrentUser({ ...auth.currentUser });
      }
      
      toast({
        title: "Account created successfully!",
        description: "Welcome to HobbyHub!",
      });
      
      return userCredential;
    } catch (error: any) {
      console.error(error);
      
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      });
      
      throw error;
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      return result;
    } catch (error: any) {
      console.error(error);
      
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message,
      });
      
      throw error;
    }
  };

  // Sign in with Google
  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      toast({
        title: "Welcome to HobbyHub!",
        description: "You've successfully signed in with Google.",
      });
      return result;
    } catch (error: any) {
      console.error(error);
      
      toast({
        variant: "destructive",
        title: "Google sign in failed",
        description: error.message,
      });
      
      throw error;
    }
  };

  // Sign out
  const logOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
    } catch (error: any) {
      console.error(error);
      
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message,
      });
      
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    signUp,
    signIn,
    googleSignIn,
    logOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
