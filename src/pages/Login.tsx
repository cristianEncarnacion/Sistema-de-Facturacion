import styles from "../components/stylesComponents/Login.module.css";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { values, onChange, error, login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (values.email && values.password) {
      login(values.email, values.password);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Bienvenido</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Correo Electrónico"
            value={values.email}
            onChange={onChange}
            required
            className={styles.input}
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={values.password}
            onChange={onChange}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Iniciar Sesión
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.footer}>
          <a href="/registro">¿No tienes cuenta? Regístrate</a>
        </div>
      </div>
      <div className={styles.back}>
        <a href="/registro">Volver</a>
      </div>
    </div>
  );
};

export default Login;
