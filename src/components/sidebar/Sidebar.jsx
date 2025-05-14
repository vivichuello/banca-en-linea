import styles from './Sidebar.module.css';

export const Sidebar = () => {
    return (
        <nav className={styles.sidebar_nav}>
            <ul>
                <li>Inicio</li>
                <li>Movimientos</li>
                <li>Transferencias</li>
                <li>Pago de matrículas</li>
            </ul>
        </nav>
    )
}