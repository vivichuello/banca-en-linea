import styles from './Sidebar.module.css';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {

    const navigate = useNavigate();

    return (
        <nav className={styles.sidebar_nav}>
            <ul>
                <li onClick={() => navigate("/home")} style= {{cursor: "pointer"}}>Inicio</li>
                <li onClick={() => navigate("/transferencias")} style= {{cursor: "pointer"}}>Transferencias</li>
                <li onClick={() => navigate("/cambiar-contrasena")} style= {{cursor: "pointer"}}>Gestion Usuario</li>
            </ul>
        </nav>
    )
}