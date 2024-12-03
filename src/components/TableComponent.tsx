import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import styles from "../components/stylesComponents/TableComponent.module.css";

interface Column {
  name: string;
  selector: (row: any) => any;
}

interface TableComponentProps {
  columns: Column[];
  data: any;
  onDelete: (id: number) => void;
}

const TableComponent: React.FC<TableComponentProps> = ({
  columns,
  data,
  onDelete,
}) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index} className={styles.th}>
              {col.name}
            </th>
          ))}
          <th className={styles.th}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row: any, index: number) => (
          <tr key={index}>
            {columns.map((col: Column, colIndex: number) => (
              <td key={colIndex} className={styles.td}>
                {col.selector(row)}
              </td>
            ))}
            <td className={styles.td}>
              <button
                className={styles.actionsButton}
                onClick={() => onDelete(row.id)}
                aria-label="Eliminar"
              >
                <FontAwesomeIcon className={styles.icon} icon={faTrash} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
