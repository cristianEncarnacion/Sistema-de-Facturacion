import { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import TableComponent from "../components/TableComponent";
import { supabase } from "../DataBase/Client";
import { useAuth } from "../context/AuthContext";

interface Factura {
  id: number;
  cliente: string;
  producto: string;
  codigo: string;
  cantidad: number;
  precio: number;
  fecha: string;
  total_facturado: number;
  metodo_pago: string;
}

interface Column {
  name: string;
  selector: (row: Factura) => string | number;
}

const columns: Column[] = [
  { name: "Cliente", selector: (row) => row.cliente },
  { name: "Producto", selector: (row) => row.producto },
  { name: "Código", selector: (row) => row.codigo },
  { name: "Cantidad", selector: (row) => row.cantidad },
  { name: "Precio", selector: (row) => row.precio },
  { name: "Fecha", selector: (row) => new Date(row.fecha).toLocaleString() },
  { name: "Método de Pago", selector: (row) => row.metodo_pago },
];

const Contabilidad = () => {
  const [data, setData] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<Factura[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const { data, error } = await supabase
            .from("ventas")
            .select("*")
            .eq("user_id", user.id);
          if (error) {
            throw error;
          }
          setData(data);
          setFilteredData(data);
        } else {
          console.log("Usuario no autenticado");
        }
      } catch (error) {
        console.error("Error al obtener los datos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleSearch = () => {
    const filtered = data.filter(
      (item) =>
        (item.cliente?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (item.producto?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (item.codigo?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("ventas").delete().eq("id", id);
      if (error) throw error;

      setData(data.filter((item) => item.id !== id));
      setFilteredData(filteredData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error al eliminar el dato", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar factura"
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

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <TableComponent
          columns={columns}
          data={filteredData}
          onDelete={handleDelete}
        />
      )}
    </Layout>
  );
};

export default Contabilidad;
