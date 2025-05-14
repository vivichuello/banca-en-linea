import styles from "./MensajeError.module.css";

function ErrorMensaje({ mensaje }) {
    return mensaje ? <span className={styles.errorMensaje}>{mensaje}</span> : null;
}

function ErrorGlobal({ mensaje, onClose }) {
    return (
        mensaje && (
            <div className={styles.errorGlobalOverlay}>
                <div className={styles.errorGlobal}>
                    <div className={styles.errorIcono}>
                        X
                    </div>
                    <p>{mensaje}</p> 
                    <button onClick={onClose}>Cerrar</button>
                </div>
            </div>
        )
    );
}

export { ErrorMensaje, ErrorGlobal };
