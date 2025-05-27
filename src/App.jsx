
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InicioSesion from "./pages/InicioSesion";
import Registro from "./pages/Registro";
import Home from "./pages/Home";
import Change from "./pages/ChangePassword";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<InicioSesion />} />  
                <Route path="/iniciar-sesion" element={<InicioSesion />} /> 
                <Route path="/registrarse" element={<Registro />} /> 
                <Route path="/home" element={<Home />} /> 
                
            </Routes>
        </Router>
    );
}

export default App;
