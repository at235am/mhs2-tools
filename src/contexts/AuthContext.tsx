import { Provider, Session, User } from "@supabase/supabase-js";
import { useState, useEffect, createContext, useContext } from "react";

// import { auth, createLabProfile, db } from "../utils/firebase";

import { auth } from "../utils/supabase";

type State = {
  user: User | null;
  register: (
    email: string,
    password: string
  ) => Promise<{
    user: User | null;
    session: Session | null;
    error: Error | null;
    data: User | Session | null;
  }>;
  login: (
    email: string,
    password: string
  ) => Promise<{
    session: Session | null;
    user: User | null;
    provider?: Provider | undefined;
    url?: string | null | undefined;
    error: Error | null;
    data: Session | null;
  }>;

  logout: () => Promise<{
    error: Error | null;
  }>;
};

const AuthContext = createContext<State | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};
const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(auth.user());

  useEffect(() => {
    window.addEventListener("storage", async () => {
      const token = localStorage.getItem("supabase.auth.token");

      if (token) {
        try {
          const session = JSON.parse(token);
          const refreshToken = session.currentSession.refresh_token;
          const currentSession = auth.session();
          if (!currentSession) auth.setSession(refreshToken);
        } catch (error) {
          console.error(error);
        }
      } else {
        auth.signOut();
      }
    });

    const state = auth.onAuthStateChange((event, session) => {
      setUser(session ? session.user : null);
    });

    return () => {
      state.data?.unsubscribe();
    };
  }, []);

  // const user = auth.user();

  const register = (email: string, password: string) => {
    return auth.signUp({ email, password });
  };

  const login = (email: string, password: string) => {
    return auth.signIn({ email, password });
  };

  const logout = () => {
    return auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// const useAuth = () => useContext(AuthContext);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within a AuthProvider");
  return context;
};

// const useRequireAuth = () => {
//   const auth = useAuth();
//   // const router = useRouter();

//   useEffect(() => {
//     console.log("auth", auth);
//     console.log("Checking user", auth.user);

//     if (!auth.user) {
//       console.log("Redirecting", auth.user);
//       router.push("/");
//     }
//   }, [auth, router]);

//   return auth;
// };

export { AuthProvider, useAuth };
