import EncabezadoInicio from "../components/encabezado_inicio/EncabezadoInicio";
import FormularioRegistro from "../components/formulario_registro/FormularioRegistro";


import "./Registro.css"

function InicioSesion() {  
return (
    <div className="pagina-inicio">
        <header>
            <EncabezadoInicio />
        </header>
        <div className="registro">
            <FormularioRegistro />
            
        </div>
    </div>
);

}

export default InicioSesion;  
