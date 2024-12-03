import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import { Factura } from "./pages/Factura";
import Inventario from "./pages/Inventario"; // Importación sin llaves, ya que es exportación por defecto
import Contabilidad from "./pages/Contabilidad";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import AgregarFactura from "./pages/AgregarFactura";
import PrivateRoute from "./PrivateRoute";
import Cliente from "./pages/Cliente";
import Proveedor from "./pages/Proveedor";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route
            path="/inicio"
            element={<PrivateRoute element={<Inicio />} />}
          />
          <Route
            path="/cliente"
            element={<PrivateRoute element={<Cliente />} />}
          />
          <Route
            path="/factura"
            element={<PrivateRoute element={<Factura />} />}
          />
          <Route
            path="/inventario"
            element={<PrivateRoute element={<Inventario />} />}
          />
          <Route
            path="/proveedor"
            element={<PrivateRoute element={<Proveedor />} />}
          />
          <Route
            path="/contabilidad"
            element={<PrivateRoute element={<Contabilidad />} />}
          />
          <Route
            path="/nuevaFactura"
            element={<PrivateRoute element={<AgregarFactura />} />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
