import { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import TableComponent from "../components/TableComponent";
import { supabase } from "../DataBase/Client";
import { useAuth } from "../context/AuthContext";

interface FacturaData {
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

const columns = [
  { name: "Cliente", selector: (row: FacturaData) => row.cliente || "N/A" },
  { name: "Producto", selector: (row: FacturaData) => row.producto || "N/A" },
  { name: "Código", selector: (row: FacturaData) => row.codigo || "N/A" },
  { name: "Cantidad", selector: (row: FacturaData) => row.cantidad || 0 },
  {
    name: "Precio",
    selector: (row: FacturaData) =>
      `$${row.precio ? row.precio.toFixed(2) : "0.00"}`,
  },
  {
    name: "Fecha",
    selector: (row: FacturaData) =>
      row.fecha ? new Date(row.fecha).toLocaleDateString() : "Sin fecha",
  },

  {
    name: "Método de Pago",
    selector: (row: FacturaData) => row.metodo_pago || "N/A",
  },
];

export const Factura = () => {
  const [listaFacturas, setListaFacturas] = useState<FacturaData[]>([]);
  const [filteredData, setFilteredData] = useState<FacturaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchFacturas = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("ventas")
          .select("*")
          .eq("user_id", user?.id);

        if (error) throw error;
        if (data) {
          setListaFacturas(data);
          setFilteredData(data);
        }
      } catch (error) {
        console.error("Error al obtener las facturas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacturas();
  }, [user?.id]);

  const handleSearch = () => {
    const searchLower = searchTerm.toLowerCase();
    const filtered = listaFacturas.filter(
      (item) =>
        item.cliente.toLowerCase().includes(searchLower) ||
        item.producto.toLowerCase().includes(searchLower) ||
        item.codigo.toLowerCase().includes(searchLower)
    );
    setFilteredData(filtered);
  };

  // Eliminar factura por ID
  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from("ventas").delete().eq("id", id);

      if (error) throw error;

      const updatedList = listaFacturas.filter((item) => item.id !== id);
      setListaFacturas(updatedList);
      setFilteredData(updatedList);
    } catch (error) {
      console.error("Error al eliminar la factura:", error);
    }
  };

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Botón para agregar nueva factura */}
        <button
          style={{
            fontSize: "14px",
            backgroundColor: "#0d6efd",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
          <a href="/nuevaFactura" className="btn btn-primary">
            Agregar Factura
          </a>
        </button>

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
              width: "100%",
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
              marginTop: "10px",
              width: "100%",
            }}
          >
            Buscar
          </button>
        </div>
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

export default Factura;
