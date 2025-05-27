import { useState, useEffect } from "react";
import { findUserByAccountNumberAPI, whoAmIAPI, getBalanceAPI } from "../../api/modules/user";
import { createTransferAPI } from "../../api/modules/movements";
import styles from './TransferForm.module.css';
import { ErrorGlobal} from "../mensaje_error/MensajeError";
import { SuccessMessage } from "../SuccessMessage/SuccessMessage";

export const TransferForm = () => {

    // 1- Estado del componente. Datos a hacer seguimiento seran monto, nro de cuenta, descripcion
    const [accountNumber, setAccountNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({
        accountNumber: "",
        amount: "",
        description: ""
    })
    const [userAccountNUmber, setUserAccountNumber] = useState("");
    const [userBalance, setUserBalance] = useState("");
    const [successMessage, setsuccessMessage] = useState(null)

    useEffect(() => {
        const fetchUserData = async () => {
            const user = await whoAmIAPI();
            if (user?.account_number) setUserAccountNumber(user.account_number);
            const saldo = await getBalanceAPI();
            setUserBalance(saldo);
        }
        fetchUserData();
    }, [])

    // 2- Funciones para manejar cada cambio de los inputs

    const handleAccountNumberChange = (e) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                accountNumber: 'Introducir solo digitos numericos'
            }));
            return;
        }
        if (value.length > 20) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                accountNumber: 'El numero de cuenta debe tener 20 digitos'
            }));
            return;
        }
        setErrors((prevErrors) => ({ ...prevErrors, accountNumber: '' }));
        setAccountNumber(value);
    }

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (!/^\d*\.?\d*$/.test(value)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                amount: 'Solo numeros permitidos'
            }));
            return;
        }
        if (parseFloat(value) <= 0) {
            setErrors(prevErrors => ({
                ...prevErrors,
                amount: 'El monto debe ser mayor a 0'
            }))
            return;
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                amount: ''
            }))
        }
        setErrors(prevErrors => ({
            ...prevErrors,
            amount: ''
        }))
        setAmount(value);
    }

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        if (value.length > 100) {
            setErrors((prev) => ({ ...prev, description: "Máximo 100 caracteres." }));
            return;
        }
        setErrors((prev) => ({ ...prev, description: "" }));
        setDescription(value);
    };

    // 3- Funcion para manejar las diferentes validaciones

    const validateFields = () => {

        let valid = true;
        let newErrors = { accountNumber: "", amount: "", description: "" };

        if (!accountNumber || accountNumber.length !== 20) {
            newErrors.accountNumber = "El numero de cuenta debe tener 20 digitos";
            valid = false;
        }

        if (accountNumber === userAccountNUmber) {
            newErrors.accountNumber = 'No puedes transferir a tu propia cuenta';
            valid = false;
        }

        if (!amount || parseFloat(amount) <= 0) {
            newErrors.amount = "El monto debe ser mayor a 0"
            valid = false;
        }

        if (userBalance !== null && parseFloat(amount) > userBalance ) {
            newErrors.amount = "El monto no puede ser mayor al saldo disponible";
            valid = false;
        }
        
        if (!description) {
            newErrors.description = "La descripción es obligatoria.";
            valid = false;
        }
        setErrors(newErrors)
        return valid;
    }

    const handleClear = () => {
        setAccountNumber("");
        setAmount("");
        setDescription("");
        setErrors({
            accountNumber: "",
            amount: "",
            description: ""
        });
        setMessage("");
        setsuccessMessage(null)
    };
    // 3- Funcion para manejar el envio del formulario

    const handleTransfer = async (e) => {
        e.preventDefault();
        setMessage(""); // Reiniciar mensaje
        setsuccessMessage(null)

        if (!validateFields()) {
            return; // Si la validación falla, no continuar
        }

        try {
            //Buscamos usuario por numero de cuenta
            console.log("Observa que nro de cuenta se envia:", accountNumber)
            const userResponse = await findUserByAccountNumberAPI(accountNumber);

            if (!userResponse) {
                setMessage("Error: No se encontró el usuario con ese número de cuenta.");
                return;
            }

            // Si el usuario existe, procedemos a crear la transferencia

            const transferData = {
                amount: parseFloat(amount),
                account_number: accountNumber,
                description: description
            }

            const transferResponse = await createTransferAPI(transferData);
            setsuccessMessage({
                amount: transferResponse.amount,
                createdAt: transferResponse.created_at,
                id: transferResponse.id
            });

        } catch (error) {
            console.error("Error creando transferencia:", error);
            setMessage("Error creando transferencia");
        }
    }

    return (
        <div>
            <h2>Realizar Transferencia</h2>

            <form onSubmit={handleTransfer} className={styles.transfer_form}>

                <div className={styles.input_container}>
                    <label htmlFor="accountNumber">Cuenta Destino</label>
                    <input
                        id="accountNumber"
                        type="text"
                        placeholder="Numero de cuenta"
                        value={accountNumber}
                        onChange={handleAccountNumberChange}
                    />
                    {errors.accountNumber && <p className={styles.error_p} style={{ color: "red" }}>{errors.accountNumber}</p>}
                </div>
                <div className={styles.input_container}>
                    <label htmlFor="amount">Monto</label>
                    <input
                        id="amount"
                        type="number"
                        placeholder="Monto"
                        value={amount}
                        onChange={handleAmountChange}
                        maxLength={20}
                    />
                    {errors.amount && <p className={styles.error_p} style={{ color: "red", padding: 0, margin: 0 }}>{errors.amount}</p>}
                </div>
                <div className={styles.input_container}>
                    <label htmlFor="description">Descripcion</label>
                    <input
                        type="text"
                        placeholder="Descripcion"
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                    {errors.description && <p className={styles.error_p} style={{ color: "red" }}>{errors.description}</p>}
                </div>
                <div className={styles.btn_container}>
                    <button type="submit" >Transferir</button>
                    <button type="button" onClick={handleClear}>Limpiar</button>
                </div>
                {successMessage && (
                    <SuccessMessage
                    amount={successMessage.amount}
                    createdAt={successMessage.createdAt}
                    id={successMessage.id}
                    onClose={() => setsuccessMessage(null)}
                    />
                )}
                {message && <ErrorGlobal mensaje={message} onClose={() => setMessage("")}/>}
            </form>
        </div>
    )
}