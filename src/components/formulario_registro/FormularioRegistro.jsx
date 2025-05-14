import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CampoEntradaInicio from "../campo_entrada_inicio/CampoEntradaInicio";
import BotonInicio from "../boton_inicio/BotonInicio";
import styles from "./FormularioRegistro.module.css";
import { registerAPI } from "../../api/modules/index";

function FormularioRegistro() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        document_number: "",
        birth_date: "",
        phone_number: "",
        email: "",
        password: "",
        confirm_password: ""
    });

    const [errores, setErrores] = useState({});
    const [errorGlobal, setErrorGlobal] = useState("");
    const [registroExitoso, setRegistroExitoso] = useState(false); // ✅ Estado para el overlay
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        setErrores({ ...errores, [id]: "" });
    };

    const formatBirthDate = (date) => {
        if (!date) return "";
        const fecha = new Date(date);
        return isNaN(fecha.getTime()) ? "" : fecha.toISOString();
    };

    const validarFormulario = () => {
        let nuevosErrores = {};

        // ✅ Validación de edad mínima (18 años)
        const fechaNacimiento = new Date(formData.birth_date);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

        if (
            hoy.getMonth() < fechaNacimiento.getMonth() ||
            (hoy.getMonth() === fechaNacimiento.getMonth() && hoy.getDate() < fechaNacimiento.getDate())
        ) {
            edad--;
        }

        if (edad < 18) {
            nuevosErrores.birth_date = "Debes tener al menos 18 años.";
            setErrorGlobal("La edad mínima para registrarse es 18 años.");
        }

        // ✅ Validación de contraseñas antes de enviar el formulario
        if (formData.password !== formData.confirm_password) {
            nuevosErrores.confirm_password = "Las contraseñas no coinciden.";
            setErrorGlobal("Las contraseñas deben coincidir.");
        }

        return nuevosErrores;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorGlobal("");
        let nuevosErrores = validarFormulario();
        setErrores(nuevosErrores);

        if (Object.keys(nuevosErrores).length > 0) return;

        const datosRegistro = { ...formData, birth_date: formatBirthDate(formData.birth_date) };

        try {
            const response = await registerAPI(datosRegistro);
            console.log("Respuesta de la API:", response);

            if (response.errors.length > 0) {
                let nuevosErroresAPI = {};
                response.errors.forEach((error) => {
                    if (error.field) {
                        nuevosErroresAPI[error.field] = error.message;
                    } else {
                        setErrorGlobal(error.error);
                    }
                });
                setErrores(nuevosErroresAPI);
            } else if (response.message === "Usuario registrado con éxito") {
                console.log("Registro exitoso:", response);
                setRegistroExitoso(true); // ✅ Activamos el overlay
                setTimeout(() => navigate("/iniciar-sesion"), 3000); // ✅ Redirigir tras 3 segundos
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            setErrorGlobal("Ocurrió un problema al conectar con el servidor.");
        }
    };

    return (
        <div className={styles.formularioRegistro}>
            <form onSubmit={handleSubmit} noValidate>
                <CampoEntradaInicio tipo="text" id="first_name" nombre="Nombre" placeholder="Escribe tu nombre" valor={formData.first_name} onChange={handleChange} error={errores.first_name} />
                <CampoEntradaInicio tipo="text" id="last_name" nombre="Apellido" placeholder="Escribe tu apellido" valor={formData.last_name} onChange={handleChange} error={errores.last_name} />
                <CampoEntradaInicio tipo="text" id="document_number" nombre="Documento" placeholder="Número de documento" valor={formData.document_number} onChange={handleChange} error={errores.document_number} />
                <CampoEntradaInicio tipo="date" id="birth_date" nombre="Fecha de nacimiento" valor={formData.birth_date} onChange={handleChange} error={errores.birth_date} />
                <CampoEntradaInicio tipo="tel" id="phone_number" nombre="Teléfono" placeholder="Número de teléfono" valor={formData.phone_number} onChange={handleChange} error={errores.phone_number} />
                <CampoEntradaInicio tipo="email" id="email" nombre="Correo" placeholder="Escribe tu correo" valor={formData.email} onChange={handleChange} error={errores.email} />
                <CampoEntradaInicio tipo="password" id="password" nombre="Contraseña" placeholder="Crea una contraseña" valor={formData.password} onChange={handleChange} error={errores.password} />
                <CampoEntradaInicio tipo="password" id="confirm_password" nombre="Confirmar contraseña" placeholder="Repite tu contraseña" valor={formData.confirm_password} onChange={handleChange} error={errores.confirm_password} />
                <div className={styles.contenedorBoton}>
                    <BotonInicio id="boton-registro" texto="Registrarse" />
                </div>
            </form>

            {errorGlobal && <p className={styles.errorGlobal}>{errorGlobal}</p>}

            <p className={styles.volver} onClick={() => navigate("/iniciar-sesion")}>Volver</p> 

            {registroExitoso && ( 
                <div className={styles.overlay} onClick={() => setRegistroExitoso(false)}> 
                    <div className={styles.overlayContent}>
                        <p>🎉 ¡Usuario registrado con éxito! Redirigiendo al inicio de sesión...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FormularioRegistro;
