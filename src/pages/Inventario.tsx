import { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import FormularioGenerico from "../components/FormularioGenerico";
import TableComponent from "../components/TableComponent";
import { supabase } from "../DataBase/Client";
import { useAuth } from "../context/AuthContext";

interface Producto {
  id: number;
  producto: string;
  codigo: string;
  cantidad: number;
  precio_compra: number;
  precio_venta: number;
  proveedor: string;
  user_id: string; // Asegurarse de incluir el campo `user_id`
}

const columns = [
  { name: "Producto", selector: (row: Producto) => row.producto },
  { name: "Código", selector: (row: Producto) => row.codigo },
  { name: "Cantidad", selector: (row: Producto) => row.cantidad },
  {
    name: "Precio de compra",
    selector: (row: Producto) => `$${row.precio_compra.toFixed(2)}`,
  },
  {
    name: "Precio de venta",
    selector: (row: Producto) => `$${row.precio_venta.toFixed(2)}`,
  },
  { name: "Proveedor", selector: (row: Producto) => row.proveedor },
];

const Inventario = () => {
  const [data, setData] = useState<Producto[]>([]);
  const [filteredData, setFilteredData] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch inicial de datos por usuario
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return; // Asegúrate de que el usuario está autenticado

      try {
        const { data: inventarioData, error: fetchError } = await supabase
          .from("productos")
          .select("*")
          .eq("user_id", user.id); // Filtrar por user_id

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        setData(inventarioData || []);
        setFilteredData(inventarioData || []);
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setError("Error al obtener el inventario.");
      }
    };

    fetchData();
  }, [user?.id]);

  // Búsqueda de productos
  const handleSearch = () => {
    const searchLower = searchTerm.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.producto.toLowerCase().includes(searchLower) ||
        item.codigo.toLowerCase().includes(searchLower)
    );
    setFilteredData(filtered);
  };

  // Manejo del formulario para agregar productos
  const handleSubmit = async (values: Omit<Producto, "id" | "user_id">) => {
    setError(null);

    try {
      if (!user?.id) {
        setError("Usuario no autenticado.");
        return;
      }

      // Verificar si ya existe un producto con el mismo código para este usuario
      const { data: existingProducts, error: checkError } = await supabase
        .from("productos")
        .select("*")
        .eq("codigo", values.codigo)
        .eq("user_id", user.id);

      if (checkError) {
        throw new Error(checkError.message);
      }

      if (existingProducts.length > 0) {
        setError(
          "El código del producto ya existe. Por favor, elija otro código."
        );
        return;
      }

      // Insertar el nuevo producto con `user_id`
      const { data: insertedData, error: insertError } = await supabase
        .from("productos")
        .insert([{ ...values, user_id: user.id }]); // Agregar user_id al insertar

      if (insertError) {
        throw new Error(insertError.message);
      }

      // Actualizar el estado local
      if (insertedData) {
        setData((prevData) => [...prevData, ...insertedData]);
        setFilteredData((prevData) => [...prevData, ...insertedData]);
      }
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Error al agregar el producto.");
    }
  };

  // Manejo para eliminar un producto
  const handleDelete = async (id: number) => {
    setError(null);

    try {
      if (!user?.id) {
        setError("Usuario no autenticado.");
        return;
      }

      const { error: deleteError } = await supabase
        .from("productos")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id); // Asegurarse de que el producto pertenece al usuario

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      // Actualizar el estado local
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
      setFilteredData(updatedData);
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Error al eliminar el producto.");
    }
  };

  const fields = [
    {
      name: "producto",
      label: "Producto",
      type: "text",
      placeholder: "Ingrese el nombre del producto",
    },
    {
      name: "codigo",
      label: "Código",
      type: "text",
      placeholder: "Ingrese el código del producto",
    },
    {
      name: "cantidad",
      label: "Cantidad",
      type: "number",
      placeholder: "Ingrese la cantidad disponible",
    },
    {
      name: "precio_compra",
      label: "Precio de compra",
      type: "number",
      placeholder: "Ingrese el precio de compra",
    },
    {
      name: "precio_venta",
      label: "Precio de venta",
      type: "number",
      placeholder: "Ingrese el precio de venta",
    },
    {
      name: "proveedor",
      label: "Proveedor",
      type: "text",
      placeholder: "Ingrese el nombre del proveedor",
    },
  ];

  return (
    <Layout>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar producto"
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
        initialValues={{}}
      />

      <TableComponent
        columns={columns}
        data={filteredData}
        onDelete={handleDelete}
      />
    </Layout>
  );
};

export default Inventario;
