import styles from "./ContactItem.module.css";
import { useState } from "react";
import { updateContactAPI, deleteContactAPI } from "../../api/modules/index";
import { ErrorMensaje } from "../mensaje_error/MensajeError";
import CampoEntradaInicio from "../campo_entrada_inicio/CampoEntradaInicio";

import editStyles from "./OverlayEdit.module.css";
import deleteStyles from "./OverlayDelete.module.css";

const ContactItem = ({ contact, onRefresh, onSelect = () => {} }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    alias: contact.alias,
    descripcion: contact.description,
  });

  const [errores, setErrores] = useState({});

  const [mensajeExito, setMensajeExito] = useState("");
  const [mostrarOverlayExito, setMostrarOverlayExito] = useState(false);

  const [mensajeError, setMensajeError] = useState("");
  const [mostrarOverlayError, setMostrarOverlayError] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value.trim() }));
    setErrores(prev => ({ ...prev, [id]: "" }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formData.alias || formData.alias.length < 2 || formData.alias.length > 20) {
      nuevosErrores.alias = "El alias debe tener entre 2 y 20 caracteres.";
    }
    if (!formData.descripcion || formData.descripcion.length < 5 || formData.descripcion.length > 30) {
      nuevosErrores.descripcion = "La descripción debe tener entre 5 y 30 caracteres.";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrores({});
    setMensajeError("");
    setMostrarOverlayError(false);

    if (!validarFormulario()) return;

    try {
      await updateContactAPI(contact.id, {
        alias: formData.alias,
        description: formData.descripcion,
      });

      setIsEditing(false);
      setMensajeExito("Contacto actualizado exitosamente.");
      setMostrarOverlayExito(true);
    } catch (error) {
      console.error("Error al actualizar:", error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          if (data.message === "Ya estás usando ese alias en otro contacto") {
            setErrores((prev) => ({ ...prev, alias: data.message }));
            return;
          } else if (data.message === "Ya tienes agregado a este contacto") {
            setMensajeError(data.message);
          } else {
            setMensajeError("Error de validación. Revisa los datos ingresados.");
          }
        } else {
          setMensajeError("Error inesperado al actualizar el contacto.");
        }
      } else {
        setMensajeError("No se pudo conectar al servidor.");
      }

      setMostrarOverlayError(true);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteContactAPI(contact.id);
      setIsDeleting(false);
      setMensajeExito("Contacto eliminado exitosamente.");
      setMostrarOverlayExito(true);
    } catch (error) {
      console.error("Error al eliminar:", error);
      setMensajeError("No se pudo eliminar el contacto.");
      setMostrarOverlayError(true);
    }
  };

  const cerrarOverlayExito = () => {
    setMostrarOverlayExito(false);
    setMensajeExito("");
    onRefresh();
  };

  const cerrarOverlayError = () => {
    setMostrarOverlayError(false);
    setMensajeError("");
  };

  return (
    <li className={styles.contactItem}>
      <div
        className={styles.contactItemDisplay}
        onClick={() => onSelect(contact.account_number)}
      >
        <span className={styles.alias}>{contact.alias}</span>
        <span className={styles.description}>{contact.description}</span>
        <div className={styles.itemButtons}>
          <button
            type="button"
            onClick={() => {
              setFormData({ alias: contact.alias, descripcion: contact.description });
              setErrores({});
              setMensajeError("");
              setIsEditing(true);
            }}
          >
            Edit
          </button>
          <button type="button" onClick={() => setIsDeleting(true)}>Delete</button>
        </div>
      </div>

      {isEditing && (
        <div className={editStyles.overlayEditWrapper}>
          <div className={editStyles.overlayEdit}>
            <h3>Editar Contacto</h3>
            <CampoEntradaInicio
              tipo="text"
              id="alias"
              nombre="Alias"
              valor={formData.alias}
              onChange={handleChange}
              error={errores.alias}
            />
            <CampoEntradaInicio
              tipo="text"
              id="descripcion"
              nombre="Descripción"
              valor={formData.descripcion}
              onChange={handleChange}
              error={errores.descripcion}
            />
            <div className={editStyles.editButtons}>
              <button type="button" className={editStyles.save} onClick={handleUpdate}>
                Guardar
              </button>
              <button type="button" className={editStyles.cancel} onClick={() => setIsEditing(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleting && (
        <div className={deleteStyles.overlayDelete}>
          <h3>¿Eliminar Contacto?</h3>
          <p>Esta acción no se puede deshacer.</p>
          <div className={deleteStyles.deleteButtons}>
            <button type="button" className={deleteStyles.confirm} onClick={handleDelete}>
              Confirmar
            </button>
            <button type="button" className={deleteStyles.cancel} onClick={() => setIsDeleting(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {mostrarOverlayExito && (
        <div className={styles.overlayExito} onClick={cerrarOverlayExito}>
          <div className={styles.overlayExitoContenido}>
            <p>{mensajeExito}</p>
            <button type="button" onClick={cerrarOverlayExito}>Cerrar</button>
          </div>
        </div>
      )}

      {mostrarOverlayError && mensajeError && (
        <div className={styles.overlayError} onClick={cerrarOverlayError}>
          <div className={styles.overlayErrorContenido}>
            <p>{mensajeError}</p>
            <button type="button" onClick={cerrarOverlayError}>Cerrar</button>
          </div>
        </div>
      )}
    </li>
  );
};

export default ContactItem;
