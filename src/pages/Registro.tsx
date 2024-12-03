import { useState } from "react";
import styles from "../components/stylesComponents/Login.module.css";
import { supabase } from "../DataBase/Client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Registro = () => {
  const { setUser, values, setValues, onChange } = useAuth();

  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleRegistro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      values.email === "" ||
      values.password === "" ||
      values.confirmpassword === ""
    ) {
      setError("Por favor, rellene todos los campos");
      return;
    } else if (values.password !== values.confirmpassword) {
      setError("Las contraseñas no coinciden");
      return;
    } else {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        });

        if (error) {
          setError("Error al registrar: " + error.message);
          return;
        }

        const user = data.user;

        if (user) {
          alert(
            "Registro exitoso. Por favor, revisa tu correo para confirmar tu cuenta."
          );
          setUser(user);
          console.log(user);
          setValues({ email: "", password: "", confirmpassword: "" });
          navigate("/");
        } else {
          setError("Registro fallido, el usuario no se creó correctamente.");
        }
      } catch (error: any) {
        setError("Error al registrar: " + error.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Regístrate</h2>
        <form className={styles.form} onSubmit={handleRegistro}>
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
          <input
            name="confirmpassword"
            type="password"
            placeholder="Confirmar Contraseña"
            value={values.confirmpassword}
            onChange={onChange}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Registrar
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.footer}>
          <a href="/">¿Ya tienes cuenta? Inicia sesión</a>
        </div>
      </div>
      <div className={styles.back}>
        <a href="/">Volver</a>
      </div>
    </div>
  );
};

export default Registro;
