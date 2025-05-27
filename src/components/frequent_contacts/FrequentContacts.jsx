import { useState, useEffect } from "react";
import { getContactsListAPI } from "../../api/modules/index";
import ContactItem from "../contact_item/ContactItem";
import styles from "./FrequentContacts.module.css";

function FrequentContacts({ isOpen, onClose }) {
    const [contacts, setContacts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (isOpen) {
            loadContacts();
        }
    }, [isOpen, page]);

    const loadContacts = async () => {
        setLoading(true);
        try {
            const response = await getContactsListAPI(page);
            if (response && response.data) {
                setContacts(response.data); // 🔹 Carga la lista sin manejar edición/eliminación aquí
            }
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
        setLoading(false);
    };

    const filteredContacts = contacts.filter(contact =>
        contact.alias.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectContact = (accountNumber) => {
        console.log("Función ejecutada - Número de cuenta:", accountNumber); // 🔹 Si aparece esto, la función se ejecuta bien
    };


    {filteredContacts.map(contact => (
        <ContactItem 
            key={contact.id} 
            contact={contact} 
            onRefresh={loadContacts} 
            onSelect={handleSelectContact} // 🔹 Aseguramos que se está pasando correctamente
        />
    ))}




    return (
        isOpen && (
            <div className={styles.overlay} onClick={onClose}>
                <button type="button" className={styles.closeBtn} onClick={onClose}>✖</button>

                <div className={styles.overlayContent} onClick={(e) => e.stopPropagation()}>
                    <h2>Frequent Contacts</h2>

                    <div className={styles.searchSection}>
                        <input
                            type="text"
                            placeholder="Escribe el alias"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {loading ? (
                        <p>Loading contacts...</p>
                    ) : (
                        <>
                            {filteredContacts.length > 0 ? (
                                <ul className={styles.contactsList}>
                                    {filteredContacts.map(contact => (
                                        <ContactItem key={contact.id} contact={contact} onRefresh={loadContacts} />
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay contactos que coincidan.</p>
                            )}

                            <div className={styles.pagination}>
                                <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</button>
                                <button type="button" disabled={contacts.length < 10} onClick={() => setPage(page + 1)}>Siguiente</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    );
}

export default FrequentContacts;
