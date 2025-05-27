import React from 'react';
import styles from './Home.module.css'
import { Header } from '../components/header/Header';
import { Sidebar } from '../components/sidebar/Sidebar';

import ChangePassword from '../components/change_password/ChangePassword.jsx';

const Home = () => {

    return (
        <div className={styles.home_container}>
            <Header />
            <div className={styles.home_layout}>
                <Sidebar />
                <main className={styles.home_main_content}>
                    <ChangePassword/>
                    
                </main>
            </div>
        </div >
    );
};

export default Home;
