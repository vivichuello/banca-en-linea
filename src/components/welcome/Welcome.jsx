import styles from './Welcome.module.css';

export const Welcome = () => {
    return (
        <section className={styles.welcome_container}>
            <div className={styles.welcome_user_dates}>
                <h1>Bienvenido, User</h1>
                <p>Tu ultima conexion exitosa fue: 00/00/2025 a las 00/00</p>
            </div>

            <div className={styles.welcome_balance}>
                <p>Saldo disponible</p>
                <h2>$1023.23</h2>
            </div>
        </section>
    )

}