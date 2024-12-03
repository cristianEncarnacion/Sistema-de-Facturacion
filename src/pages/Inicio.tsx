import { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { supabase } from "../DataBase/Client";
import { Bar, Line, Pie } from "react-chartjs-2";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import { FaFileAlt, FaBox, FaUsers, FaUserTie } from "react-icons/fa";

// Registrando los elementos de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

// Estilos responsivos usando styled-components
const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;

  @media screen and (max-width: 900px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const Card = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChartContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;

  @media screen and (max-width: 900px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

interface ChartCardProps {
  $spanFull?: boolean;
}

const ChartCard = styled.div<ChartCardProps>`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: ${(props) => (props.$spanFull ? "100%" : "50%")};

  @media screen and (max-width: 900px) {
    width: 100%;
  }
`;

const Inicio = () => {
  const { user } = useAuth();
  interface Invoice {
    fecha: string;
    cantidad: number;
    precio: number;
    metodo_pago: string;
  }

  interface ChartData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string | string[];
      borderColor: string | string[];
      borderWidth?: number;
      fill?: boolean;
      tension?: number;
    }[];
  }

  const [invoiceData, setInvoiceData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  const [revenueData, setRevenueData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  const [paymentMethodData, setPaymentMethodData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  const [loading, setLoading] = useState(true);
  const [totalFacturas, setTotalFacturas] = useState(0);
  const [totalProductos, setTotalProductos] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalProveedores, setTotalProveedores] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Obtener datos de facturas
        const { data: invoices, error: invoiceError } = await supabase
          .from("ventas")
          .select("*")
          .eq("user_id", user?.id);

        if (invoiceError) throw invoiceError;
        if (invoices) {
          setTotalFacturas(invoices.length);
          setTotalProductos(
            invoices.reduce(
              (acc: number, invoice: Invoice) => acc + invoice.cantidad,
              0
            )
          );
        }

        // const invoiceLabels: string[] = invoices.map((invoice: Invoice) =>
        //   new Date(invoice.fecha).toLocaleDateString("es-ES", { month: "long" })
        // );

        const invoiceCounts: { [key: string]: number } = invoices.reduce(
          (acc: { [key: string]: number }, invoice: Invoice) => {
            const month = new Date(invoice.fecha).toLocaleDateString("es-ES", {
              month: "long",
            });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
          },
          {}
        );

        const invoiceData = {
          labels: Object.keys(invoiceCounts),
          datasets: [
            {
              label: "Cantidad de Facturas por Mes",
              data: Object.values(invoiceCounts),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        };
        setInvoiceData(invoiceData);

        const revenueData: { [key: string]: number } = invoices.reduce(
          (acc: { [key: string]: number }, invoice: Invoice) => {
            const month = new Date(invoice.fecha).toLocaleDateString("es-ES", {
              month: "long",
            });
            acc[month] = (acc[month] || 0) + invoice.cantidad * invoice.precio;
            return acc;
          },
          {}
        );

        const revenueChartData = {
          labels: Object.keys(revenueData),
          datasets: [
            {
              label: "Ingresos por Mes",
              data: Object.values(revenueData),
              fill: false,
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              borderColor: "rgba(153, 102, 255, 1)",
              tension: 0.1,
            },
          ],
        };
        setRevenueData(revenueChartData);

        const paymentMethodCounts: { [key: string]: number } = invoices.reduce(
          (acc: { [key: string]: number }, invoice: Invoice) => {
            acc[invoice.metodo_pago] = (acc[invoice.metodo_pago] || 0) + 1;
            return acc;
          },
          {}
        );

        const paymentMethodData = {
          labels: Object.keys(paymentMethodCounts),
          datasets: [
            {
              label: "Métodos de Pago",
              data: Object.values(paymentMethodCounts),
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
              ],
              borderWidth: 1,
            },
          ],
        };
        setPaymentMethodData(paymentMethodData);

        // Obtener total de clientes
        const { data: clientes, error: clientesError } = await supabase
          .from("clientes")
          .select("*")
          .eq("user_id", user?.id);
        if (clientesError) throw clientesError;
        setTotalClientes(clientes.length);

        // Obtener total de proveedores
        const { data: proveedores, error: proveedoresError } = await supabase
          .from("proveedores")
          .select("*")
          .eq("user_id", user?.id);
        if (proveedoresError) throw proveedoresError;
        setTotalProveedores(proveedores.length);
      } catch (error) {
        console.error("Error al obtener los datos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <Layout>
      {/* Contenedor para los resúmenes */}
      <Container>
        {/* Total de Facturas */}
        <Card>
          <div>
            <h4>Total de Facturas</h4>
            <p>{totalFacturas}</p>
          </div>
          <FaFileAlt size={32} color="#4a90e2" />
        </Card>

        {/* Total de Productos */}
        <Card>
          <div>
            <h4>Total de Productos</h4>
            <p>{totalProductos}</p>
          </div>
          <FaBox size={32} color="#7ed321" />
        </Card>

        {/* Total de Clientes */}
        <Card>
          <div>
            <h4>Total de Clientes</h4>
            <p>{totalClientes}</p>
          </div>
          <FaUsers size={32} color="#e94e77" />
        </Card>

        {/* Total de Proveedores */}
        <Card>
          <div>
            <h4>Total de Proveedores</h4>
            <p>{totalProveedores}</p>
          </div>
          <FaUserTie size={32} color="#f5a623" />
        </Card>
      </Container>

      {/* Contenedor para los gráficos */}
      <ChartContainer>
        {/* Gráfico de Barras - Cantidad de Facturas por Mes */}
        <ChartCard>
          <h3>Cantidad de Facturas por Mes</h3>
          {loading ? <p>Cargando gráfico...</p> : <Bar data={invoiceData} />}
        </ChartCard>

        {/* Gráfico de Líneas - Ingresos por Mes */}
        <ChartCard>
          <h3>Ingresos por Mes</h3>
          {loading ? <p>Cargando gráfico...</p> : <Line data={revenueData} />}
        </ChartCard>

        {/* Gráfico de Torta - Métodos de Pago */}
        <ChartCard $spanFull={true}>
          <h3>Métodos de Pago</h3>
          {loading ? (
            <p>Cargando gráfico...</p>
          ) : (
            <Pie data={paymentMethodData} />
          )}
        </ChartCard>
      </ChartContainer>
    </Layout>
  );
};

export default Inicio;
