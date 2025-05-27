import styles from './Welcome.module.css';
import { whoAmIAPI, getBalanceAPI} from '../../api/modules/user';
import { useState, useEffect } from 'react';

export const Welcome = () => {

    // 1- Configuro estado del componente. Datos a hacer seguimiento seran el usuario y el numero de cuenta
    const [user, setUser] = useState('Cargando...');
    const [accountNumber, setAccountNumber] = useState('Cargando...');
    const [balance, setBalance] = useState('Cargando')

    // 2- Defino el useEffect para llamar a la API y obtener los datos del usuario
    useEffect(() => {
        // 3- Funcion asincrona para obtener datos del usuario
        const fetchUserData = async () => {
            try {
                const userResponse = await whoAmIAPI(); //Respuesta de la API
                console.log("Respuesta de la API desde la funcion fetchUserData:", userResponse);

                if (userResponse) {
                    setUser(userResponse);
                    setAccountNumber(userResponse.account_number)
                    console.log('Numero de cuenta:', accountNumber)
                } else {
                    console.error('Error: No se encontro datos del usuario');
                    setAccountNumber('Error al cargar el numero de cuenta');
                }

                const balanceResponse = await getBalanceAPI();
                console.log("Respuesta de getBalanceAPI:", balanceResponse);
                //setBalance(() => {balanceResponse !== null ? `Bs.${balanceResponse}` : "Error obteniendo saldo";})
                setBalance(balanceResponse)
            } catch (error) {
                console.error("Error obteniendo datos del usuario:", error);
            }
        }

        // 4- LLamo a la funcion fetchUserData
        fetchUserData();

    }, []);

    return (
        <section className={styles.welcome_container}>
            <div className={styles.welcome_user_dates}>
                <h1>Bienvenido, {user.first_name} {user.last_name} &#11088;</h1>
                <p>Numero de cuenta:  {accountNumber} </p>
            </div>

            <div className={styles.welcome_balance}>
                <p>Saldo disponible: </p>
                <h3>{new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(balance)} Bs.</h3>
            </div>
        </section>
    )

}