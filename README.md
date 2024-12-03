# Sistema de Facturación

Este es un sistema de facturación completo desarrollado en React con integración a [Supabase](https://supabase.io) como backend. El sistema permite gestionar inventarios, facturación, contabilidad, proveedores y clientes. Incluye funcionalidades de creación, edición, eliminación y visualización de datos clave para un negocio.

## Características principales

- **Gestión de Inventario**: Añade o elimina productos del inventario.
- **Facturación**: Genera y gestiona facturas de manera eficiente.
- **Contabilidad**: Monitorea ingresos y gastos.
- **Gestión de Proveedores**: Registra y administra proveedores.
- **Gestión de Clientes**: Registra y administra clientes.
- **Gráficos Interactivos**: Visualización de datos con gráficos interactivos usando Chart.js.
- **Autenticación Segura**: Manejo de usuarios con registro e inicio de sesión mediante Supabase.

## Requisitos previos

- Node.js (v16 o superior)
- NPM o Yarn
- Una cuenta de Supabase
- Git

## Instalación

Sigue estos pasos para clonar y configurar el proyecto en tu máquina:

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/cristianEncarnacion/Sistema-de-Facturacion
   cd billinsystem
   ```
2. **Instala dependencias**

```bash
    npm install
```

3. **Configura Supabase**
   -Crea un nuevo proyecto en Supabase.
   -Obtén tu SUPABASE_URL y SUPABASE_ANON_KEY desde la configuración del proyecto en el panel de Supabase.
   -Crea las siguientes tablas en tu base de datos de Supabase:
   -clientes: Para gestionar los datos de los clientes.
   -proveedores: Para gestionar los datos de los proveedores.
   -productos: Para gestionar los datos del inventario.
   -ventas: Para gestionar las facturas y ventas.

4. **Inicia la aplicacion**

```bash
npm run dev
```

5. **Accede a la aplicación: Abre tu navegador y visita: http://localhost:5173.**

## Funcionalidades

**Inventario**
-Añade productos con nombre, descripción, precio y cantidad.
-Edita la información de productos existentes.
-Elimina productos del inventario.

**Facturación**
-Genera facturas para clientes con detalles de productos y métodos de pago.
-Visualiza facturas existentes y sus detalles.
-Descarga facturas en formato PDF (próximamente).

**Contabilidad**
-Visualización de ingresos mensuales a través de gráficos.
-Monitoreo de métodos de pago utilizados.

**Proveedores**
-Registra proveedores con datos de contacto.
-Administra y elimina proveedores según sea necesario.

**Clientes**
-Registra clientes con información personal y de contacto.
-Administra y elimina clientes fácilmente.

**Autenticación**
-Registro de usuarios con correo electrónico y contraseña.
-Inicio de sesión seguro.
-Cierre de sesión y manejo de sesiones.

**Gráficos interactivos**
-Visualización de datos con gráficos de barras, líneas y tortas para análisis.

## Tecnologías utilizadas

**Frontend:**
-React.js
-TypeScript
-Styled-Components
-React-Chartjs-2
-React-Router-Dom

**Backend:**
-Supabase (Base de datos y autenticación)

## Contribuciones

Si deseas contribuir al proyecto, sigue estos pasos:

-Haz un fork del repositorio.
-Crea una nueva rama:

```bash
git checkout -b feature/nueva-funcionalidad
```

-Realiza los cambios necesarios y haz un commit:

```bash
git commit -m "Agrega nueva funcionalidad"
```

-Haz un push a tu rama:

```bash
git push origin feature/nueva-funcionalidad
```

-Abre un Pull Request.
