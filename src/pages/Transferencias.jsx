import styles from './Transferencias.module.css';
import { Header } from '../components/header/Header';
import { Sidebar } from '../components/sidebar/Sidebar';
import { TransferForm } from '../components/TransferForm/TransferForm.jsx';

const Transferencias = () => {
    return (
        <div className={styles.transferencias_container}>
            <Header />
            <div className={styles.transferencias_layout}>
                <Sidebar />
                <main className={styles.transferencias_main_content}>
                    <TransferForm />
                </main>
            </div>
        </div >
    );
}

export default Transferencias;