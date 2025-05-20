import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CampoEntradaInicio from "../campo_entrada_inicio/CampoEntradaInicio";
import BotonInicio from "../boton_inicio/BotonInicio";
import { ErrorGlobal } from "../mensaje_error/MensajeError";
import styles from "./FormularioInicio.module.css";
import { loginAPI } from "../../api/modules/index";
import { setJWT, getJWT } from "../../utils/localStorage";
import { hasFieldsErrors } from "../../utils/formValidation";

function FormularioInicio() {
    const [formData, setFormData] = useState({ usuario: "", password: "" });
    const [errores, setErrores] = useState({});
    const [errorGlobal, setErrorGlobal] = useState(""); 
    const navigate = useNavigate();

    // Maneja el cambio de valores en los inputs
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [id]: value.trim() })); // Elimina espacios
        setErrores((prevErrores) => ({ ...prevErrores, [id]: "" }));
    };

    // Validaciones antes de enviar el formulario
    const validarFormulario = () => {
        const validaciones = {
            usuario: ["required", "email"],
            password: ["required", { minLength: 8 }]
        };

        let nuevosErrores = hasFieldsErrors(formData, validaciones);

        //  Primero, si está vacío, mostrar "Campo requerido"
        if (!formData.password.trim()) {
            nuevosErrores.password = "Campo requerido";
        }
        //  Luego, si no está vacío pero es menor a 8 caracteres, mostrar mensaje de longitud mínima
        else if (formData.password.trim().length < 8) {
            nuevosErrores.password = "Debe contener al menos 8 caracteres.";
        }
        //  Si es mayor a 16 caracteres, mostrar mensaje de límite máximo
        else if (formData.password.trim().length > 16) {
            nuevosErrores.password = "Debe contener máximo 16 caracteres.";
        }

        //  Evita espacios dentro de la contraseña
        if (!nuevosErrores.password && formData.password.includes(" ")) {
            nuevosErrores.password = "La contraseña no debe contener espacios.";
        }

        setErrores(nuevosErrores);
        return nuevosErrores;
    };



    // Manejo del envío de formulario y autenticación
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorGlobal("");

        let nuevosErrores = validarFormulario();
        if (Object.values(nuevosErrores).some(error => error)) return; 

        const datosLogin = { email: formData.usuario, password: formData.password };

        console.log("Datos enviados a la API:", JSON.stringify(datosLogin, null, 2));

        try {
          const datosLogin = { email: formData.usuario, password: formData.password };
          const response = await loginAPI(datosLogin);
          console.log("Respuesta de la API:", response);

          if (response.data && response.data.jwt) {
              setJWT(response.data.jwt);
              navigate("/home");
          }

          if (response.message === "Usuario no autorizado, credenciales incorrectas") {
              setErrorGlobal("Correo o contraseña incorrectos.");
          } else if (response.errors) {
              let nuevosErroresAPI = {};
              response.errors.forEach((error) => {
                  if (error.field) {
                      nuevosErroresAPI[error.field] = error.message;
                  }
              });
              setErrores(nuevosErroresAPI);
          }
      } catch (error) {
          console.error("Error en la solicitud:", error);

          //  Si la API responde con 401, mostramos el mensaje correcto
          if (error.response && error.response.status === 401) {
              setErrorGlobal("Correo o contraseña incorrectos.");
          } else {
              setErrorGlobal("Ocurrió un problema al conectar con el servidor.");
          }
      }

    };

    return (
        <div className={styles.formularioInicio}>
            <form className={styles.formularioIS} onSubmit={handleSubmit} noValidate>
                <CampoEntradaInicio
                    tipo="text"
                    id="usuario"
                    nombre="Correo"
                    placeholder="Escribe tu correo"
                    valor={formData.usuario}
                    onChange={handleChange}
                    error={errores.usuario}
                />
                <CampoEntradaInicio
                    tipo="password"
                    id="password"
                    nombre="Contraseña"
                    placeholder="Escribe tu contraseña"
                    valor={formData.password}
                    onChange={handleChange}
                    error={errores.password}
                />
                <BotonInicio texto="Iniciar Sesión" />
            </form>

            {errorGlobal && (
                <ErrorGlobal mensaje={errorGlobal} onClose={() => setErrorGlobal("")} />
            )}
        </div>
    );
}

export default FormularioInicio;
