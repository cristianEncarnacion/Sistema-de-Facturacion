import { useState, useEffect, ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "./DataBase/Client"; // Asegúrate de que la ruta es correcta

interface PrivateRouteProps {
  element: ReactElement;
  [key: string]: any;
}

const PrivateRoute = ({ element: Component }: PrivateRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session?.user);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? Component : <Navigate to="/" />;
};

export default PrivateRoute;
