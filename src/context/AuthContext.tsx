import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../DataBase/Client";
import { useNavigate } from "react-router-dom";
import { Usuarios } from "../types/User";

interface AuthContextType {
  id: string;
  user: User | null;
  setUser: (user: User | null) => void;
  checkUser: () => void;
  login: (email: string, password: string) => void;
  isAuth: boolean;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  values: Usuarios;
  setValues: React.Dispatch<React.SetStateAction<Usuarios>>;
}

interface User {
  id: string;
  email: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [values, setValues] = useState<Usuarios>({
    email: "",
    password: "",
    confirmpassword: "",
  });

  const navigate = useNavigate();
  const publicRoutes = ["/", "/registro"];

  const checkUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session && session.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
        });
        setIsAuth(true);
      } else if (!publicRoutes.includes(location.pathname)) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error al verificar el usuario:", error);
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Credenciales incorrectas");
        return;
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || "",
        });
        setIsAuth(true);
        navigate("/inicio");
      } else {
        setError("No se pudo iniciar sesión. Verifique sus credenciales.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Ocurrió un error inesperado. Intente nuevamente.");
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        id: user?.id || "",
        user,
        setUser,
        checkUser,
        login,
        isAuth,
        error,
        onChange,
        values,
        setValues,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
