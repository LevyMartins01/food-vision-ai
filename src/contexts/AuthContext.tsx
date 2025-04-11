
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  subscription: {
    plan: string;
    isActive: boolean;
  } | null;
  signOut: () => Promise<void>;
  uploadCredits: {
    canUpload: boolean;
    uploadsRemaining: number | null;
    isPaidUser: boolean;
  } | null;
  refreshUploadCredits: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<{
    plan: string;
    isActive: boolean;
  } | null>(null);
  const [uploadCredits, setUploadCredits] = useState<{
    canUpload: boolean;
    uploadsRemaining: number | null;
    isPaidUser: boolean;
  } | null>(null);

  // Function to refresh upload credits
  const refreshUploadCredits = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('check-upload-limit');
      
      if (error) throw error;
      
      setUploadCredits(data);
    } catch (error) {
      console.error("Error checking upload limit:", error);
    }
  };

  // Handle auth state changes
  useEffect(() => {
    const fetchUserData = async (userId: string) => {
      try {
        // Fetch subscription data
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from("subscriptions")
          .select("plan_type, is_active")
          .eq("user_id", userId)
          .single();
        
        if (subscriptionError) throw subscriptionError;
        
        setSubscription({
          plan: subscriptionData.plan_type,
          isActive: subscriptionData.is_active
        });

        // Check upload limits
        await refreshUploadCredits();
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    setIsLoading(true);

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setSubscription(null);
        setUploadCredits(null);
      }

      setIsLoading(false);
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        subscription,
        signOut,
        uploadCredits,
        refreshUploadCredits
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
