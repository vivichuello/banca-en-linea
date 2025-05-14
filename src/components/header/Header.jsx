import logoNoBack from '../../assets/logo-no-background.png'
import styles from './Header.module.css'
import React from 'react'

export const Header = () => {
    return (
        <header className={styles.header}>
            <figure>
                <img src={logoNoBack} alt="Logo de la institucion" />
            </figure>
            <button className={styles.header_btn_logout}>Cerrar Sesión</button>
        </header>

    )
}