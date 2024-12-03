import { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import FormularioGenerico from "../components/FormularioGenerico";
import TableComponent from "../components/TableComponent";
import { supabase } from "../DataBase/Client";
import { useAuth } from "../context/AuthContext";

interface ProveedorData {
  id?: number; // Incluye ID para manejar eliminaciones
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
}

interface Column {
  name: string;
  selector: (row: ProveedorData) => string;
}

const columns: Column[] = [
  { name: "Nombre", selector: (row) => row.nombre || "Sin nombre" },
  { name: "Correo", selector: (row) => row.email || "Sin correo" },
  { name: "Teléfono", selector: (row) => row.telefono || "Sin teléfono" },
  { name: "Dirección", selector: (row) => row.direccion || "Sin dirección" },
];

const Proveedor = () => {
  const [data, setData] = useState<ProveedorData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredData, setFilteredData] = useState<ProveedorData[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: proveedorData, error: proveedorError } = await supabase
          .from("proveedores")
          .select("*")
          .eq("user_id", user?.id); // Filtrar por el usuario actual

        if (proveedorError) {
          console.error("Error fetching proveedores:", proveedorError.message);
          setError("Error al obtener los datos.");
        }

        if (proveedorData) {
          setData(proveedorData);
          setFilteredData(proveedorData);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setError("Error inesperado al obtener datos.");
      }
    };

    fetchData();
  }, [user?.id]);

  // Búsqueda en tiempo real
  const handleSearch = () => {
    const filtered = data.filter(
      (item) =>
        (item.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (item.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Manejar inserciones
  const handleSubmit = async (values: ProveedorData) => {
    try {
      const newProveedor = { ...values, user_id: user?.id }; // Aseguramos incluir user_id
      const { data: insertedData, error: insertError } = await supabase
        .from("proveedores")
        .insert(newProveedor)
        .select();

      if (insertError) {
        console.error("Error inserting data:", insertError.message);
        setError("Error al insertar datos.");
      } else {
        setData((prevData) => [...prevData, ...insertedData]);
        setFilteredData((prevData) => [...prevData, ...insertedData]); // Actualiza la lista filtrada
        setError(null);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("Error inesperado al insertar datos.");
    }
  };

  // Manejar eliminación
  const handleDelete = async (id: number) => {
    try {
      const { error: deleteError } = await supabase
        .from("proveedores")
        .delete()
        .eq("id", id);

      if (deleteError) {
        console.error("Error deleting data:", deleteError.message);
        setError("Error al eliminar datos.");
      } else {
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
        setFilteredData(updatedData);
        setError(null);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("Error inesperado al eliminar datos.");
    }
  };

  // Campos para el formulario
  const fields = [
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
      placeholder: "Ingrese el nombre",
    },
    {
      name: "email",
      label: "Correo",
      type: "email",
      placeholder: "Ingrese el correo electrónico",
    },
    {
      name: "telefono",
      label: "Teléfono",
      type: "text",
      placeholder: "Ingrese el teléfono",
    },
    {
      name: "direccion",
      label: "Dirección",
      type: "text",
      placeholder: "Ingrese la dirección",
    },
  ];

  return (
    <Layout>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar proveedor"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 16px",
            fontSize: "14px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Buscar
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      <FormularioGenerico
        fields={fields}
        onSubmit={handleSubmit}
        initialValues={{ nombre: "", email: "", telefono: "", direccion: "" }}
      />
      <TableComponent
        columns={columns}
        data={filteredData}
        onDelete={(id) => handleDelete(id)}
      />
    </Layout>
  );
};

export default Proveedor;
