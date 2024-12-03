import styles from "../assets/styles/Layout.module.css";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  return (
    <div className={styles.gridContainer}>
      <Navbar />
      <Sidebar />
      <div className={styles.content}>{children}</div>
    </div>
  );
};
