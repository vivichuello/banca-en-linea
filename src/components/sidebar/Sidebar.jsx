import styles from './Sidebar.module.css';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {

    const navigate = useNavigate();

    return (
        <nav className={styles.sidebar_nav}>
            <ul>
                <li>Inicio</li>
                <li>Movimientos</li>
                <li onClick={() => navigate("/transferencias")} style= {{cursor: "pointer"}}>Transferencias</li>
                <li>Pago de matrículas</li>
            </ul>
        </nav>
    )
}