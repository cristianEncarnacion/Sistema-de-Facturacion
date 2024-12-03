import { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import FormularioGenerico from "../components/FormularioGenerico";
import TableComponent from "../components/TableComponent";
import { supabase } from "../DataBase/Client";
import { useAuth } from "../context/AuthContext";

// Definición de tipos
interface ClienteData {
  id?: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
}

const Cliente = () => {
  const [data, setData] = useState<ClienteData[]>([]);
  const [filteredData, setFilteredData] = useState<ClienteData[]>([]);
  const [formValues, setFormValues] = useState<ClienteData>({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: clientes, error } = await supabase
          .from("clientes")
          .select("*")
          .eq("user_id", user?.id);

        if (error) throw new Error(error.message);
        if (clientes) {
          setData(clientes);
          setFilteredData(clientes);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user) fetchData();
  }, [user]);

  // Manejo del envío del formulario
  const handleSubmit = async (values: ClienteData) => {
    const { nombre, email, telefono, direccion } = values;

    if (!nombre || !email || !telefono || !direccion) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const { data: newClient, error } = await supabase
        .from("clientes")
        .insert([{ ...values, user_id: user?.id }])
        .select();

      if (error) throw new Error(error.message);
      if (newClient) {
        setData((prevData) => [...prevData, ...newClient]);
        setFilteredData((prevData) => [...prevData, ...newClient]);
        setFormValues({ nombre: "", email: "", telefono: "", direccion: "" });
      }
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };

  const handleSearch = () => {
    const searchLower = searchTerm.toLowerCase();
    const filtered = data.filter(
      ({ nombre, email, telefono, direccion }) =>
        nombre.toLowerCase().includes(searchLower) ||
        email.toLowerCase().includes(searchLower) ||
        telefono.toLowerCase().includes(searchLower) ||
        direccion.toLowerCase().includes(searchLower)
    );
    setFilteredData(filtered);
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    try {
      const { error } = await supabase.from("clientes").delete().eq("id", id);
      if (error) throw new Error(error.message);

      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
      setFilteredData(updatedData);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const fields = [
    {
      name: "nombre",
      label: "Nombre",
      placeholder: "Ingrese el nombre",
      type: "text",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Ingrese el email",
      type: "email",
    },
    {
      name: "telefono",
      label: "Teléfono",
      placeholder: "Ingrese el teléfono",
      type: "text",
    },
    {
      name: "direccion",
      label: "Dirección",
      placeholder: "Ingrese la dirección",
      type: "text",
    },
  ];

  const columns = [
    { name: "Nombre", selector: (row: ClienteData) => row.nombre },
    { name: "Email", selector: (row: ClienteData) => row.email },
    { name: "Teléfono", selector: (row: ClienteData) => row.telefono },
    { name: "Dirección", selector: (row: ClienteData) => row.direccion },
  ];

  return (
    <Layout>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar cliente"
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
      <FormularioGenerico
        fields={fields}
        onSubmit={handleSubmit}
        initialValues={formValues}
      />
      <TableComponent
        columns={columns}
        data={filteredData}
        onDelete={handleDelete}
      />
    </Layout>
  );
};

export default Cliente;
