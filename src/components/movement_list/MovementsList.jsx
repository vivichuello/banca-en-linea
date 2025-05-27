//1 - Importaciones necesarias
import { useState, useEffect } from 'react';
import DataTables from 'react-data-table-component';
import { getMovementsAPI } from '../../api/modules/movements';
import { getJWT } from '../../utils/localStorage';
import styles from './MovementsList.module.css';
import { ErrorGlobal } from '../mensaje_error/MensajeError';

// 2 - Declarar columnas

const columns = [
    {
        name: 'Fecha',
        selector: row => row.created_at,
        cell: row => row.created_at ? new Date(row.created_at).toLocaleDateString('es-ES') : 'Fecha no disponible'
    },
    {
        name: 'Descripcion',
        selector: row => row.description
    },
    {
        name: 'Credito/Debito',
        selector: 'multiplier',
        cell: row => (
            <span className={row.multiplier === 1 ? styles.credit : styles.debit}>
                {row.multiplier === 1 ? 'Crédito' : 'Débito'}
            </span>
        ),
        sortable: true
    },
    {
        name: 'Monto',
        selector: row => row.amount,
        cell: row => row.amount ? new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.amount)
            : '0,00'
    },
    {
        name: 'Balance',
        selector: row => row.balance,
        cell: row => row.balance
            ? new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.balance)
            : '0,00'
    }
]

const customStyles = {
    headCells: {
        style: {
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#49beb7',
            textAlign: 'center',
            fontSize: '16px',
        },
    },
    rows: {
        style: {
            backgroundColor: '#f9f9f9'
        },
    },
    cells: {
        style: {
            textAlign: 'center',
        },
    },
};

// 3 - Crear el componente MovementsList

export const MovementsList = () => {

    // 4 - Definir estados
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalRows, setTotalRows] = useState(0);
    const [multiplier, setMultiplier] = useState(0);


    // 5 - useEffect para llamar a la funcion obtenerMovimientos
    useEffect(() => {
        const obtenerMovimientos = async () => {
            const token = getJWT();
            if (token) {
                console.log('Token encontrado:', token);
                setLoading(true); // Cambiamos el estado de loading a true
                setError(null); // Reiniciamos el estado de error

                try {

                    //Declaramos parametros
                    let apiParams = {
                        page,
                        page_size: pageSize,
                    }

                    //Si el valor de multiplier es diferente de 0, lo agregamos a los parametros
                    if (multiplier !== 0) {
                        apiParams.multiplier = multiplier;
                    }

                    //LLamamos a la funcion getMovementsAPI
                    const response = await getMovementsAPI(apiParams)

                    const totalCountHeader = response.headers["x-pagination-total-count"];
                    const data = response.data;

                    if (totalCountHeader !== undefined && totalCountHeader !== null && Array.isArray(data) && data.length > 0) {
                        setMovements(data);
                        setTotalRows(Number(totalCountHeader));
                        setError(null); 
                    } else {
                        setError('No se pudo obtener la información de movimientos. Intente aumentando el número de movimientos por página o revisando los filtros aplicados.');
                    }

                } catch (error) {
                    setError('No se pudo obtener la información de movimientos. Intente aumentando el número de movimientos por página o revisando los filtros aplicados.');
                }
                finally {
                    setLoading(false);
                }
            } else {
                console.warn('JWT no encontrado. No se cargarán los movimientos.');
            }
        };
        obtenerMovimientos();
    }, [page, pageSize, multiplier]);

    // 7 - Retornamos el componente 

    return (

        <div className={styles.container}>
            <h3>Listado de Movimientos</h3>
            <div className={styles.filter}>
                <label>
                    Tipo de movimiento:
                    <select onChange={(e) => {
                        setMultiplier(Number(e.target.value))
                        setPage(1)
                    }}
                    >
                        <option value={0}>Todos</option>
                        <option value={1}>Créditos</option>
                        <option value={-1}>Débitos</option>
                    </select>
                </label>
            </div>

            {loading && <p>Cargando...</p>} {/* Si loading es true, mostramos un mensaje de carga */}
            {error && <ErrorGlobal mensaje={error} onClose={() => setError(null)}/>} {/* Si hay un error, mostramos el mensaje de error */}

            <DataTables
                key={`${multiplier}-${pageSize}`}
                columns={columns}
                data={movements}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangePage={setPage}
                onChangeRowsPerPage={newPageSize => {
                    setPageSize(newPageSize);
                    setPage(1);
                }}
                paginationPerPage={pageSize}
                paginationRowsPerPageOptions={[5, 10, 20, 50]}
                customStyles={customStyles}>
            </DataTables>
        </div>

    )
}