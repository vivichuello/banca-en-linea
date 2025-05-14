import styles from "./EncabezadoInicio.module.css";

function EncabezadoInicio() {
    return (
        <header className={styles.encabezado}>
            <nav className={styles.navContenedor}>
                <div className={styles.navContenedor}>
                    <figure className={styles.navFigura}>
                        <img 
                            src="/src/assets/logo-no-background.png" 
                            alt="Logo Universitario" 
                            className={styles.navLogo} 
                        />
                    </figure>
                    <div className={styles.datos}>
                        <h2>Acceso a la Banca en Línea</h2>
                        <p>
                            <a href="sitio_web_institucional.html" className={styles.regresar}>
                                Volver a la página principal
                            </a>
                        </p>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default EncabezadoInicio;
