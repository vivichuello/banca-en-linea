import { useState } from "react";
import { getJWT } from "../../utils/localStorage";
import styles from "./ChangePassword.module.css";
import { changePasswordAPI } from "../../api/modules/index";
import { hasFieldsErrors } from "../../utils/formValidation";
import CampoEntradaInicio from "../campo_entrada_inicio/CampoEntradaInicio";
import BotonInicio from "../boton_inicio/BotonInicio";
import { ErrorGlobal } from "../mensaje_error/MensajeError"; // ✅ Importamos ErrorGlobal

function ChangePassword() {
    // Estado para los datos del formulario
    const [formData, setFormData] = useState({
        password: "",
        new_password: "",
        confirm_new_password: ""
    });

    // Manejo de errores y estados adicionales
    const [errores, setErrores] = useState({});
    const [errorGlobal, setErrorGlobal] = useState("");
    const [registroExitoso, setRegistroExitoso] = useState(false);

    // Maneja el cambio de valores en los inputs
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [id]: value,
        }));
        setErrores((prevErrores) => ({
            ...prevErrores,
            [id]: "",
        }));
    };

    // Validaciones del formulario
    const validarFormulario = () => {
        const validaciones = {
            password: ["required", { minLength: 8 }, { maxLength: 16 }],
            new_password: ["required", { minLength: 8 }, { maxLength: 16 }],
            confirm_new_password: [{ sameAs: formData.new_password }, "required"]
        };

        let nuevosErrores = hasFieldsErrors(formData, validaciones);

        // Validación manual de campos vacíos
        for (let campo in formData) {
            if (!formData[campo].trim()) {
                nuevosErrores[campo] = "Campo requerido";
            }
        }

        // Validación adicional para la contraseña
        if (!nuevosErrores.password && formData.password.trim().length > 16) {
            nuevosErrores.password = "Debe contener máximo 16 caracteres.";
        }
        if (!nuevosErrores.password && formData.password.includes(" ")) {
            nuevosErrores.password = "La contraseña no debe contener espacios.";
        }

        if (!nuevosErrores.new_password && formData.new_password.trim().length > 16) {
            nuevosErrores.new_password = "Debe contener máximo 16 caracteres.";
        }
        if (!nuevosErrores.new_password && formData.new_password.includes(" ")) {
            nuevosErrores.new_password = "La contraseña no debe contener espacios.";
        }

        if (formData.new_password.trim() === formData.password.trim()) {
            nuevosErrores.new_password = "La nueva contraseña no puede ser igual a la anterior.";
        }

        setErrores(nuevosErrores);
        return nuevosErrores;
    };

    // Manejo del envío de formulario y comunicación con la API
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorGlobal("");

        let nuevosErrores = validarFormulario();
        if (Object.values(nuevosErrores).some((error) => error)) return;

        // Datos ajustados para la API
        const datosCambio = {
            password: formData.password.trim(),
            new_password: formData.new_password.trim()
        };

        console.log("Datos enviados a la API:", JSON.stringify(datosCambio, null, 2));

        try {
            // Obtener token JWT
            const token = getJWT();

            // Enviar solicitud con autenticación
            const response = await changePasswordAPI(datosCambio, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            console.log("Respuesta de la API:", response);

            // Manejo de errores específicos de la API
            if (response.errors?.length > 0) {
                let nuevosErroresAPI = {};
                response.errors.forEach((error) => {
                    if (error.field) {
                        nuevosErroresAPI[error.field] = error.message;
                    }
                });
                setErrores(nuevosErroresAPI);
            }

            // Verificar mensajes de la API
            if (response.message === "Usuario no autorizado, credenciales incorrectas") {
                setErrorGlobal("Contraseña incorrecta. Por favor, intenta nuevamente.");
            } else if (response.message === "Contraseña actualizada con éxito") {
                console.log("Cambio de contraseña exitoso:", response);
                setRegistroExitoso(true);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);

            // Manejo de errores globales
            if (error.response && error.response.status === 401) {
                setErrorGlobal("La contraseña actual no es correcta.");
            } else {
                setErrorGlobal("Ocurrió un problema al conectar con el servidor.");
            }
        }
    };

    // Cierra el modal y resetea los valores
    const cerrarModal = () => {
        setRegistroExitoso(false);
        setFormData({
            password: "",
            new_password: "",
            confirm_new_password: ""
        });
        setErrores({});
    };

    return (
        <div className={styles.changePassword}>
            <h2>Cambio de contraseña</h2>
            <form onSubmit={handleSubmit} noValidate>
                <CampoEntradaInicio
                    tipo="password"
                    id="password"
                    nombre="Contraseña actual"
                    placeholder="Ingresa tu contraseña actual"
                    valor={formData.password}
                    onChange={handleChange}
                    error={errores.password}
                />
                <CampoEntradaInicio
                    tipo="password"
                    id="new_password"
                    nombre="Nueva contraseña"
                    placeholder="Crea una nueva contraseña"
                    valor={formData.new_password}
                    onChange={handleChange}
                    error={errores.new_password}
                />
                <CampoEntradaInicio
                    tipo="password"
                    id="confirm_new_password"
                    nombre="Confirmar contraseña"
                    placeholder="Repite tu nueva contraseña"
                    valor={formData.confirm_new_password}
                    onChange={handleChange}
                    error={errores.confirm_new_password}
                />

                <div className={styles.contenedorBoton}>
                    <BotonInicio id="boton-cambio" texto="Confirmar" />
                </div>
            </form>

            {errorGlobal && <ErrorGlobal mensaje={errorGlobal} onClose={() => setErrorGlobal("")} />}

            {registroExitoso && (
                <div className={styles.overlay} onClick={() => cerrarModal()}>
                    <div className={styles.overlayContent}>
                        <p id="exito">¡Contraseña actualizada exitosamente!</p>
                        <BotonInicio id="boton-cerrar-modal" texto="Aceptar" onClick={cerrarModal} />
                    </div>
                </div>
            )}

        </div>
    );
}

export default ChangePassword;
