import { useState, useEffect } from "react";
import styles from "../assets/styles/Factura.module.css";

interface Field {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  className?: string;
}

interface FormularioGenericoProps<T = { [key: string]: any }> {
  fields: any;

  onSubmit: any;

  initialValues?: T;

  onChange?: (name: string, value: any) => void;
}

const FormularioGenerico = ({
  fields,
  onSubmit,
  initialValues,
  onChange,
}: FormularioGenericoProps) => {
  const [values, setValues] = useState(initialValues || {});

  useEffect(() => {
    if (initialValues) {
      setValues(initialValues);
    }
  }, [initialValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
    if (onChange) {
      onChange(name, value);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {fields &&
        fields.map((field: Field) => (
          <div
            key={field.name}
            className={field.className ? styles[field.className] : ""}
          >
            <label htmlFor={field.name} className={styles.label}>
              {field.label}
            </label>
            {field.type === "select" ? (
              <select
                name={field.name}
                id={field.name}
                value={values[field.name] || ""}
                onChange={handleChange}
                className={styles.formControl}
              >
                <option value="" disabled>
                  {field.placeholder}
                </option>
                {field.options &&
                  field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                id={field.name}
                value={values[field.name] || ""}
                onChange={handleChange}
                placeholder={field.placeholder}
                className={styles.formControl}
              />
            )}
          </div>
        ))}
      <div className={styles.boton}>
        <button type="submit">Enviar</button>
      </div>
    </form>
  );
};

export default FormularioGenerico;
