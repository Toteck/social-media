import { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";

interface AuthContextType {
  user: User | null;
  signInWithGoogle: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  console.log({ user });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Atualize a função signInWithGoogle
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            hd: "acad.ifma.edu.br",
          },
        },
      });

      if (error) throw error;

      // Verificação adicional após login
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (
        !user?.email?.endsWith("@acad.ifma.edu.br") ||
        !(
          user?.identities?.[0]?.identity_data?.custom_claims?.hd ===
          "acad.ifma.edu.br"
        )
      ) {
        await supabase.auth.signOut();
        throw new Error("Apenas e-mails institucionais do IFMA são permitidos");
      }

      return data;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const signOut = () => {
    supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within the AuthProvider");
  }
  return context;
};
