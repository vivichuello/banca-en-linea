import styles from './SuccessMessage.module.css'

export const SuccessMessage = ({ amount, createdAt, id, onClose }) => (
    <div className={styles.success_container}>
        <div style={{ background: "#fff", padding: "32px 40px", borderRadius: "12px", minWidth: "380px", position: "relative", textAlign: "center" }}>
            <span className={styles.succes_icon}>✅ ¡Transferencia exitosa!</span>
            <p>Monto: {amount}</p>
            <p>Fecha: {new Date(createdAt).toLocaleString('es-ES')}</p>
            <p>ID: {id}</p>
            <button className={styles.close_btn} onClick={onClose}>❌</button>
        </div>
    </div >
);