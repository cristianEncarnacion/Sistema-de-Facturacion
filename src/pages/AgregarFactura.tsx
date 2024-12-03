import { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import FormularioGenerico from "../components/FormularioGenerico";
import TableComponent from "../components/TableComponent";
import { supabase } from "../DataBase/Client";
import { useAuth } from "../context/AuthContext";

interface Cliente {
  id: number;
  nombre: string;
}

interface Producto {
  id: number;
  producto: string;
  codigo: string;
  precio_venta: number;
  cantidad: number;
}

interface Venta {
  id: number;
  cliente: number;
  producto: number;
  codigo: string;
  cantidad: number;
  precio: number;
  fecha: string;
  metodo_pago: string;
  precio_total?: number;
  producto_nombre?: string;
}

const columns = [
  { name: "Cliente", selector: (row: Venta) => row.cliente },
  { name: "Producto", selector: (row: Venta) => row.producto_nombre || "" },
  { name: "Código", selector: (row: Venta) => row.codigo },
  { name: "Cantidad", selector: (row: Venta) => row.cantidad },
  { name: "Precio Total", selector: (row: Venta) => row.precio_total || 0 },
  {
    name: "Fecha",
    selector: (row: Venta) => new Date(row.fecha).toLocaleString(),
  },
  { name: "Método de Pago", selector: (row: Venta) => row.metodo_pago },
];

const AgregarFactura = () => {
  const [data, setData] = useState<Venta[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [values, setValues] = useState<Partial<Venta>>({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return; // Verificar autenticación

      try {
        // Obtener productos del usuario actual
        const { data: productosData, error: productosError } = await supabase
          .from("productos")
          .select("*")
          .eq("user_id", user.id)
          .gt("cantidad", 0);

        if (productosError) {
          console.error("Error fetching productos:", productosError.message);
        } else {
          setProductos(productosData || []);
        }

        // Obtener clientes del usuario actual
        const { data: clientesData, error: clientesError } = await supabase
          .from("clientes")
          .select("*")
          .eq("user_id", user.id);

        if (clientesError) {
          console.error("Error fetching clientes:", clientesError.message);
        } else {
          setClientes(clientesData || []);
        }
      } catch (error) {
        console.error("Unexpected error fetching data:", error);
      }
    };

    fetchData();
  }, [user?.id]);

  useEffect(() => {
    const fetchProductPrice = async () => {
      if (values.producto) {
        const { data: productoData, error: productoError } = await supabase
          .from("productos")
          .select("precio_venta, producto")
          .eq("id", values.producto)
          .eq("user_id", user?.id) // Verificar que el producto pertenece al usuario
          .single();

        if (productoError) {
          console.error("Error fetching product price:", productoError.message);
        } else {
          setPrecioUnitario(productoData.precio_venta);
          setValues((prevValues) => ({
            ...prevValues,
            precio: productoData.precio_venta,
            producto_nombre: productoData.producto,
          }));
        }
      } else {
        setPrecioUnitario("");
        setValues((prevValues) => ({
          ...prevValues,
          precio: undefined,
          producto_nombre: "",
        }));
      }
    };

    fetchProductPrice();
  }, [values.producto, user?.id]);

  const handleChange = (name: string, value: any) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (values: Partial<Venta>) => {
    if (!user?.id) {
      setErrorMessage("Usuario no autenticado.");
      return;
    }

    const { cliente, producto, codigo, cantidad, precio, fecha, metodo_pago } =
      values;

    if (
      !cliente ||
      !producto ||
      !codigo ||
      !cantidad ||
      !precio ||
      !fecha ||
      !metodo_pago
    ) {
      setErrorMessage("Por favor, completa todos los campos.");
      return;
    }

    const precioTotal = cantidad * precio;

    try {
      // Verificar cantidad en inventario
      const { data: productoData, error: productoError } = await supabase
        .from("productos")
        .select("cantidad")
        .eq("id", producto)
        .eq("user_id", user.id)
        .single();

      if (productoError || productoData.cantidad < cantidad) {
        setErrorMessage("Cantidad insuficiente en inventario.");
        return;
      }

      // Insertar factura
      const { error: insertError } = await supabase.from("ventas").insert([
        {
          cliente: cliente,
          producto: producto,
          codigo: codigo,
          cantidad: cantidad,
          precio: precioTotal,
          fecha: fecha,
          metodo_pago: metodo_pago,
          user_id: user.id, // Asignar al usuario actual
        },
      ]);

      if (insertError) {
        console.error("Error inserting data:", insertError.message);
        setErrorMessage("Error al insertar los datos.");
      } else {
        // Actualizar inventario
        const nuevaCantidad = productoData.cantidad - cantidad;
        const { error: updateError } = await supabase
          .from("productos")
          .update({ cantidad: nuevaCantidad })
          .eq("id", producto)
          .eq("user_id", user.id);

        if (updateError) {
          console.error("Error updating inventory:", updateError.message);
          setErrorMessage("Error al actualizar el inventario.");
        } else {
          setData((prevData) => [
            ...prevData,
            {
              id: values.id || 0,
              cliente: cliente!,
              producto: producto!,
              codigo: codigo!,
              cantidad: cantidad!,
              precio: precioTotal,
              fecha: fecha!,
              metodo_pago: metodo_pago,
              precio_total: precioTotal,
              producto_nombre: values.producto_nombre || "",
            },
          ]);
          setErrorMessage("");
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrorMessage("Error inesperado.");
    }
  };

  const fields = [
    {
      name: "cliente",
      label: "Cliente",
      type: "select",
      options: clientes.map((cliente) => ({
        label: cliente.nombre,
        value: cliente.id,
      })),
      placeholder: "Seleccione un cliente",
    },
    {
      name: "producto",
      label: "Producto",
      type: "select",
      options: productos.map((producto) => ({
        label: `${producto.producto} (Código: ${producto.codigo})`,
        value: producto.id,
      })),
      placeholder: "Seleccione un producto",
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
      placeholder: "Ingrese la cantidad",
    },
    {
      name: "precio",
      label: "Precio Unitario",
      type: "number",
      value: precioUnitario,
      placeholder: "Ingrese el precio unitario",
    },
    {
      name: "fecha",
      label: "Fecha",
      type: "date",
    },
    {
      name: "metodo_pago",
      label: "Método de Pago",
      type: "select",
      options: [
        { label: "Efectivo", value: "Efectivo" },
        { label: "Transferencia", value: "Transferencia" },
        { label: "Tarjeta", value: "Tarjeta" },
      ],
      placeholder: "Seleccione un método de pago",
    },
  ];
  const handleDelete = async (id: number) => {
    if (!user?.id) {
      setErrorMessage("Usuario no autenticado.");
      return;
    }

    try {
      const { error } = await supabase
        .from("ventas")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error al eliminar la factura:", error);
      setErrorMessage("Error al eliminar la factura.");
    }
  };

  return (
    <Layout>
      <FormularioGenerico
        fields={fields}
        onSubmit={handleSubmit}
        initialValues={values}
        onChange={handleChange}
      />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <TableComponent columns={columns} data={data} onDelete={handleDelete} />
    </Layout>
  );
};

export default AgregarFactura;
