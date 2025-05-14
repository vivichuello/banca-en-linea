//1 - Importaciones necesarias
import { useState, useEffect } from 'react';
import DataTables from 'react-data-table-component';
import { getMovementsAPI } from '../../api/modules/movements';
import styles from './MovementsList.module.css';
// 2 - Declarar columnas

const columns = [
    {
        name: 'Fecha',
        selector: row => row.created_at
    },
    {
        name: 'Descripcion',
        selector: row => row.description
    },
    {
        name: 'Credito/Debito',
        selector: 'multiplier', cell: row => (row.multiplier === 1 ? 'Crédito' : 'Débito'), sortable: true
    },
    {
        name: 'Monto',
        selector: row => row.amount
    },
    {
        name: 'Balance',
        selector: row => row.balance
    }
]

// 3 - Crear el componente MovementsList

export const MovementsList = () => {

    // 4 - Definir estados
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [multiplier, setMultiplier] = useState(0);

    // 5 - Funcion para obtener los movimientos
    const getMovements = async () => {
        // 
        setLoading(true); // Cambiamos el estado de loading a true
        setError(null); // Reiniciamos el estado de error

        try {

            //Declaramos parametros
            let apiParams = {
                page: page + 1,
                page_size: pageSize,
            }

            //Si el valor de multiplier es diferente de 0, lo agregamos a los parametros
            if (multiplier !== 0) {
                apiParams.multiplier = multiplier;
            }

            //LLamamos a la funcion getMovementsAPI
            const response = await getMovementsAPI(apiParams)

            //Si la respuesta es correcta, actualizamos el estado de movements y totalRows
            setMovements(response.data);
            setTotalRows(Number(response.headers["x-pagination-total-count"]))

        } catch (error) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }

    // 6 - useEffect para llamar a la funcion getMovements 
    useEffect(() => {
        getMovements();
    }, [page, pageSize, multiplier]);

    // 7 - Retornamos el componente 

    return (

        <div className={styles.container}>
            <h1>Listado de Movimientos</h1>
            <div className={styles.filter}>
                <label>
                    Tipo de movimiento:
                    <select onChange={(e) => setMultiplier(Number(e.target.value))}>
                        <option value={0}>Todos</option>
                        <option value={1}>Créditos</option>
                        <option value={-1}>Débitos</option>
                    </select>
                </label>
            </div>

            {loading && <p>Cargando...</p>} {/* Si loading es true, mostramos un mensaje de carga */}
            {error && <p>Error: {error}</p>} {/* Si hay un error, mostramos el mensaje de error */}

            <DataTables>
                columns={columns}
                data={movements}
                pagination
                paginationServer 
                paginationTotalRows={totalRows}
                onChangePage={setPage}
                onChangeRowsPerPage={setPageSize}
                paginationPerPage={pageSize}
                paginationRowsPerPageOptions={[5, 10, 20, 50]}
            </DataTables>
        </div>

    )
}