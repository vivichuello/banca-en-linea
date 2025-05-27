import React from 'react';
import styles from './Home.module.css'
import { Header } from '../components/header/Header';
import { Sidebar } from '../components/sidebar/Sidebar';
import { Welcome } from '../components/welcome/Welcome';
import { MovementsList } from '../components/movement_list/MovementsList.jsx';
import ChangePassword from '../components/change_password/ChangePassword.jsx';

const Home = () => {

    return (
        <div className={styles.home_container}>
            <Header />
            <div className={styles.home_layout}>
                <Sidebar />
                <main className={styles.home_main_content}>
                    <Welcome />
                    <MovementsList />
                </main>
            </div>
        </div >
    );
};

export default Home;
