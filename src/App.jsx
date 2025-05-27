
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InicioSesion from "./pages/InicioSesion";
import Registro from "./pages/Registro";
import Home from "./pages/Home";
import Change from "./pages/ChangePassword";
import  Transferencias from "./pages/Transferencias.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<InicioSesion />} />  
                <Route path="/iniciar-sesion" element={<InicioSesion />} /> 
                <Route path="/registrarse" element={<Registro />} /> 
                <Route path="/home" element={<Home />} /> 
                <Route path="/transferencias" element={<Transferencias />} />
            </Routes>
        </Router>
    );
}

export default App;
