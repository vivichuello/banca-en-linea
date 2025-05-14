
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InicioSesion from "./pages/InicioSesion";
import Registro from "./pages/Registro";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<InicioSesion />} />  
                <Route path="/iniciar-sesion" element={<InicioSesion />} />  {/* ✅ Agregamos esta ruta */}
                <Route path="/registrarse" element={<Registro />} /> 
            </Routes>
        </Router>
    );
}

export default App;
