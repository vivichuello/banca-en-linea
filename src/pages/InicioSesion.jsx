import EncabezadoInicio from "../components/encabezado_inicio/EncabezadoInicio";
import FormularioInicio from "../components/formulario_inicio/FormularioInicio";
import OpcionesInicio from "../components/opciones_sesion/OpcionesSesion";

import "./InicioSesion.css"

function InicioSesion() {  // Cambia a PascalCase
return (
    <div className="pagina-inicio">
        <header>
            <EncabezadoInicio />
        </header>
        <div className="contenido-inicio">
            <FormularioInicio />
            <OpcionesInicio />
        </div>
    </div>
);

}

export default InicioSesion;  // Exporta con el mismo nombre
