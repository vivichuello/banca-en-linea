import styles from "./CampoEntredaInicio.module.css";


import { ErrorMensaje } from "../mensaje_error/MensajeError"; // Se importa el componente de error

function CampoEntradaInicio({ tipo, id, nombre, placeholder, valor, onChange, error }) {
    return (
        <div className={styles.entrada} style={{ position: "relative" }}>
            <label htmlFor={id}>{nombre}</label>
            <input 
                type={tipo} 
                id={id} 
                name={id}
                required 
                placeholder={placeholder} 
                value={valor}
                onChange={(e) => onChange(e)}
                autoComplete="off"
            />
            {error && <ErrorMensaje mensaje={error} />}
        </div>
    );
}

export default CampoEntradaInicio;
