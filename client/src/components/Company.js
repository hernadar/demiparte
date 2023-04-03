import React from 'react'
import { useEffect, useState } from 'react';
import ProductsList from './ProductsList'
import { useParams, NavLink } from "react-router-dom"
import '@fontsource/public-sans';
import CircularProgress from '@mui/joy/CircularProgress';


function Company() {
    const { companyId } = useParams()
    const [company, setCompany] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [userCompany, setUserCompany] = useState(null)
    const [changes, setChanges] = useState([])
    const [changeDetail, setChangeDetail] = useState([])

    useEffect(() => {
        // busco en la base de datos con llamada .then, pero ahora lo hago manual 

        const empresaDelUsuario = fetch('/api/users/profile/' + sessionStorage.userId + '/company')
            .then(response => response.json())
        const detalleDeEmpresa = fetch('/api/companies/profile/' + companyId)
            .then(response => response.json())

        Promise.all([empresaDelUsuario, detalleDeEmpresa]).then(results => {
            // aquí obtenemos un array con los resultados de cada promesa
            const [empresaDelUsuario, detalleDeEmpresa] = results

            setCompany(detalleDeEmpresa.data)
            setUserCompany(empresaDelUsuario.data)

        })

    }, [companyId])

const changesByCompany = () => {

        fetch('/api/companies/' + company[0].id + '/changes/')
            .then(response => response.json())
            .then(canjes => {
                setChanges(canjes.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

const DetalleCanje = (id) => {
    if (changeDetail.length===0){
        fetch('/api/companies/' + company[0].id + '/changes/' + id)
            .then(response => response.json())
            .then(detalle => {
                setChangeDetail(detalle.data)
            })
            .catch((err) => {
                console.log(err)
            })
        }

    }


    var canjesFiltrados


    return (
        <>
            {!company && <div className="row justify-content-center mt-5">
                <CircularProgress />
            </div>}
            {company && (
                <>


                    <div className="container">
                        <div className="row justify-content-around">
                            <div className="col-sm">
                                <img className='w-100 card' src={company[0].image} alt="Companyimage" />
                            </div>
                            <div className="col-sm">
                                <h2>Bienvenidos a {company[0].name}</h2>
                                <p>{company[0].description}</p>
                            </div>


                        </div>
                        <hr className="sidebar-divider d-none d-md-block" />
                        <h5 className='fuente mb-1'>Productos ofrecidos para canje</h5>


                        <ProductsList company={company} />
                        <div className="row justify-content-around">
                            <div className="col-sm">
                                <h5 className='fuente'>Canje en Efectivo</h5>
                                <p>Por cada punto acumulado podes realizar el canje por dinero en efectivo.</p>
                                <p className='text-uppercase'>Valor del punto: </p><span className='text-success font-weight-bold'>$ {company[0].pricePoint}</span>
                            </div>

                            {!sessionStorage.userId && (
                                <div className=" card tarjeta p-1 col-sm text-danger justify-content-around text-center">

                                    Para crear una recomendación debes Iniciar Sesión con un Usuario previamente Registrado
                                    <div className="row">
                                        <div className="col-sm">

                                            <NavLink to={`/users/login`}><button className="btn btn-warning btn-sm">Iniciar Sesión</button></NavLink>

                                        </div>
                                        <div className="col-sm">

                                            <NavLink to={`/users/register`}><button className="btn btn-warning btn-sm">Registrarse</button></NavLink>

                                        </div>
                                    </div>
                                </div>)}
                            {sessionStorage.userId && (
                                <div className="col-sm m-1">

                                    <NavLink to={`/companies/${companyId}/recommendation`}><button className="btn btn-warning">Crear Recomendación</button></NavLink>

                                </div>

                            )}
                            {(company && userCompany && sessionStorage.userId && sessionStorage.userPrivilege === '2') && (
                                <>
                                    {userCompany.length != 0 &&
                                        <>
                                            {company[0].id === userCompany[0].companies_id &&
                                                <div className="col-sm m-1">

                                                    <NavLink to={`/companies/${companyId}/product/create`}><button className="btn btn-warning">Crear Producto</button></NavLink>

                                                </div>}
                                        </>
                                    }
                                </>)}
                            {(company && userCompany && sessionStorage.userId && sessionStorage.userPrivilege === '2') && (
                                <>
                                    {userCompany.length != 0 &&
                                        <>
                                            {company[0].id === userCompany[0].companies_id &&
                                                <div className="col-sm m-1">

                                                    <button className="btn btn-warning" onClick={changesByCompany}>Ver Canjes Realizados</button>

                                                </div>
                                            }
                                        </>
                                    }
                                </>
                            )}


                        </div>
                    </div>
                    {changes.length !== 0 && (
                        <>
                            <div className="table-responsive">
                                <table className="table table-sm shadow " >
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Fecha</th>
                                            <th scope="col">Nombre</th>
                                            <th scope="col">Apellido</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {changes.map((canje, i) => {
                                            let dateCorrection = canje.date + 'T00:00:00';
                                            let fecha = new Date(dateCorrection).toLocaleDateString('es-AR')

                                            return (
                                                <tr key={canje.id}>
                                                    <th scope="row">{canje.id}</th>
                                                    <td>{fecha}</td>
                                                    <td>{canje.name}</td>
                                                    <td>{canje.lastname}</td>
                                                    <td><button className="btn btn-warning" onClick={DetalleCanje(canje.id)}>...</button></td>
                                                </tr>
                                            )
                                        })}

                                    </tbody>
                                </table>
                            </div>

                            {changeDetail.length !== 0 && (

                                <table className="table table-sm shadow ">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Producto</th>
                                            <th scope="col">Puntos</th>
                                            <th scope="col">Precio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {changeDetail.map((detalleCanje, i) => {


                                            return (
                                                <tr key={detalleCanje.id}>
                                                    <th scope="row">{detalleCanje.changes_id}</th>
                                                    <td>{detalleCanje.name}</td>
                                                    <td>{detalleCanje.points}</td>
                                                    {(detalleCanje.name ==='Dinero') &&
                                                        <td>$ {detalleCanje.price}</td>
                                                    }
                                                    
                                                </tr>
                                            )

                                        })}

                                    </tbody>
                                </table>
                           


                            )}
                            <div>
                                <label>Total en Efectivo: $ {canjesFiltrados = changeDetail.filter((canje,i) =>{
                                       
                                       if(canje.name === 'Dinero'){
                                           return true
                                       }
                                       
                                   }).reduce((acc, canje) => acc += canje.price,0) }
                                    </label>
                            </div>
                        </>

                    )

                    }
                </>

            )}
        </>)
}
export default Company;