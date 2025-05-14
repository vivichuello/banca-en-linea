import styles from "./BotonInicio.module.css"

function BotonInicio({ texto, onClick }) {
    return (
        <button className={styles.botonInicio} onClick={onClick}>
            {texto}
        </button>
    );
}

export default BotonInicio;
