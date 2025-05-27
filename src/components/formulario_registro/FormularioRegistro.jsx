import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CampoEntradaInicio from "../campo_entrada_inicio/CampoEntradaInicio";
import BotonInicio from "../boton_inicio/BotonInicio";
import { ErrorGlobal } from "../mensaje_error/MensajeError"; // ✅ Importamos ErrorGlobal
import styles from "./FormularioRegistro.module.css";
import { registerAPI } from "../../api/modules/index";
import { hasFieldsErrors } from "../../utils/formValidation";

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
    const [registroExitoso, setRegistroExitoso] = useState(false);
    const navigate = useNavigate();

    // Formatea la fecha para enviarla en el formato correcto (ISO 8601)
    const formatBirthDate = (date) => {
        if (!date) return "";
        return new Date(date).toISOString();
    };

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

    const validarFormulario = () => {
        const validaciones = {
            first_name: ["required", { maxLength: 50 }],
            last_name: ["required", { maxLength: 50 }], 
            document_number: ["required", { maxLength: 20 }], 
            birth_date: ["required"], 
            phone_number: ["required", { maxLength: 15 }], 
            email: ["required", "email", { maxLength: 100 }], 
            password: ["required", { minLength: 8 }, { maxLength: 16 }], 
            confirm_password: [{ sameAs: formData.password }, "required"]
        };

        let nuevosErrores = hasFieldsErrors(formData, validaciones);

        //  Prioridad en "Campo requerido"
        for (let campo in formData) {
            if (!formData[campo].trim()) {
                nuevosErrores[campo] = "Campo requerido";
            }
        }

        // Validación manual para nombres (solo letras)
        const soloLetras = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/;
        if (!nuevosErrores.first_name && formData.first_name.trim() && !soloLetras.test(formData.first_name)) {
            nuevosErrores.first_name = "Solo se permiten letras.";
        }
        if (!nuevosErrores.last_name && formData.last_name.trim() && !soloLetras.test(formData.last_name)) {
            nuevosErrores.last_name = "Solo se permiten letras.";
        }

        //  Validación manual para números en `document_number` y `phone_number`
        const soloNumeros = /^\d+$/;
        if (!nuevosErrores.document_number && formData.document_number.trim()) {
            if (!soloNumeros.test(formData.document_number)) {
                nuevosErrores.document_number = "Solo se permiten números.";
            } else if (formData.document_number.length < 6) {
                nuevosErrores.document_number = "Debe tener al menos 6 dígitos.";
            }
        }

        if (!nuevosErrores.phone_number && formData.phone_number.trim()) {
            if (!soloNumeros.test(formData.phone_number)) {
                nuevosErrores.phone_number = "Debe contener solo números.";
            } else if (formData.phone_number.length < 10) {
                nuevosErrores.phone_number = "Debe tener al menos 10 dígitos.";
            }
        }

        // Validación manual para contraseña (mínimo y máximo)
        if (!nuevosErrores.password && formData.password.trim().length > 16) {
            nuevosErrores.password = "Debe contener máximo 16 caracteres.";
        }
        if (!nuevosErrores.password && formData.password.includes(" ")) {
            nuevosErrores.password = "La contraseña no debe contener espacios.";
        }

        //  Verificación de mayoría de edad
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
        }

        setErrores(nuevosErrores);
        return nuevosErrores;
    };


    // Manejo del envío de formulario y comunicación con la API
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorGlobal("");

        let nuevosErrores = validarFormulario();
        if (Object.values(nuevosErrores).some(error => error)) return;

        const datosRegistro = {
            ...formData,
            birth_date: formatBirthDate(formData.birth_date),
            phone_number: formData.phone_number.trim()
        };

        console.log("Datos enviados a la API:", JSON.stringify(datosRegistro, null, 2));

        try {
            const response = await registerAPI(datosRegistro);
            console.log("Respuesta de la API:", response);

            if (response.errors?.length > 0) {
                let nuevosErroresAPI = {};
                response.errors.forEach((error) => {
                    if (error.field) {
                        nuevosErroresAPI[error.field] = error.message;
                    }
                });
                setErrores(nuevosErroresAPI);
            }

            // Manejo del error cuando el usuario ya existe
            if (response.message === "Ya existe un usuario registrado con esos datos") {
                setErrorGlobal(response.message);
            } else if (response.message === "Usuario registrado con éxito") {
                console.log("Registro exitoso:", response);
                setRegistroExitoso(true);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);

            if (error.response) {
                // El servidor respondió con un error
                const msg = error.response.data?.message || "Error inesperado del servidor.";
                if (error.response.status === 409) {
                setErrorGlobal(msg || "Ya existe un usuario registrado con esos datos.");
                } else {
                setErrorGlobal(msg);
                }
            } else if (error.request) {
                // La solicitud se envió pero no hubo respuesta
                setErrorGlobal("No se pudo conectar con el servidor.");
            } else {
                // Otro error
                setErrorGlobal("Error: " + error.message);
            }
            }

    };

    return (
        <div className={styles.formularioRegistro}>
            <form onSubmit={handleSubmit} noValidate>
                <CampoEntradaInicio tipo="text" id="first_name" nombre="Nombre" placeholder="Escribe tu nombre" valor={formData.first_name} onChange={handleChange} error={errores.first_name} />
                <CampoEntradaInicio tipo="text" id="last_name" nombre="Apellido" placeholder="Escribe tu apellido" valor={formData.last_name} onChange={handleChange} error={errores.last_name} />
                <CampoEntradaInicio tipo="text" id="document_number" nombre="Documento" placeholder="Número de documento" valor={formData.document_number} onChange={handleChange} error={errores.document_number} />
                <CampoEntradaInicio tipo="date" id="birth_date" nombre="Fecha de nacimiento" placeholder="DD/MM/AAAA" valor={formData.birth_date} onChange={handleChange} error={errores.birth_date} />
                <CampoEntradaInicio tipo="tel" id="phone_number" nombre="Teléfono" placeholder="Ejemplo: 584245186631" valor={formData.phone_number} onChange={handleChange} error={errores.phone_number} />
                <CampoEntradaInicio tipo="email" id="email" nombre="Correo" placeholder="Escribe tu correo" valor={formData.email} onChange={handleChange} error={errores.email} />
                <CampoEntradaInicio tipo="password" id="password" nombre="Contraseña" placeholder="Crea una contraseña" valor={formData.password} onChange={handleChange} error={errores.password} />
                <CampoEntradaInicio tipo="password" id="confirm_password" nombre="Confirmar contraseña" placeholder="Repite tu contraseña" valor={formData.confirm_password} onChange={handleChange} error={errores.confirm_password} />
                <div className={styles.contenedorBoton}>
                    <BotonInicio id="boton-registro" texto="Registrarse" />
                </div>
            </form>

            <p className={styles.volver} onClick={() => navigate("/iniciar-sesion")}>Volver</p>


            {errorGlobal && <ErrorGlobal mensaje={errorGlobal} onClose={() => setErrorGlobal("")} />}

            {registroExitoso && (
                <div className={styles.overlay} onClick={() => setRegistroExitoso(false)}>
                    <div className={styles.overlayContent}>
                        <p id="exito"> ¡Usuario registrado exitosamente! Pulse para volver al inicio.</p>
                        <BotonInicio id="boton-ir-inicio" texto="Ir a inicio" onClick={() => navigate("/iniciar-sesion")} />
                    </div>
                </div>
            )}

        </div>
    );
}

export default FormularioRegistro;
