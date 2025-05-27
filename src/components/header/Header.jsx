import logoNoBack from '../../assets/logo-no-background.png'
import styles from './Header.module.css'
import React from 'react'
import { removeJWT, getJWT } from '../../utils/localStorage'
import { useNavigate } from 'react-router-dom'

export const Header = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        const jwt = getJWT();

        if(jwt) {
            removeJWT();
            navigate('/iniciar-sesion');
        }
    }
    return (
        <header className={styles.header}>
            <figure>
                <img src={logoNoBack} alt="Logo de la institucion" />
            </figure>
            <button className={styles.header_btn_logout} onClick={handleLogout}>Cerrar Sesión</button>
        </header>
    )
}