import React from 'react'
import { useEffect, useState } from 'react';

import ProductsList from './ProductsList'
import { useParams, NavLink } from "react-router-dom"

const imagenes = require.context('../assets/images/',true)

function Company() {
    const { companyId } = useParams()
    const [company, setCompany] = useState(null)

    useEffect(() => {
        // busco en la base de datos con llamada .then, pero ahora lo hago manual 
              
        fetch('/api/companies/profile/' + companyId)
        .then(response => response.json())
        .then (company =>{
            setCompany(company.data)
          
        })
    }, [companyId])
 
console.log(company)

    return (
        <>
        {!company && <em>Cargando...</em>}
        {company && (
            <>


                <div className="container">
                    <div className="row justify-content-around">
                        <div className="col-sm">
                            <img className='w-100 card' src={imagenes(`./logos/${company[0].image}`)} alt="Companyimage" />
                        </div>
                        <div className="col-sm">
                            <h2>Bienvenidos a {company[0].name}</h2>
                            <p>{company[0].description}</p>
                        </div>


                    </div>
                    <hr className="sidebar-divider d-none d-md-block" />
                    <h5 className='fuente mb-1'>Productos ofrecidos para canje</h5>
                   
                
                    {/* <ProductsList company={company}/> */}
                    <div className="row justify-content-around">
                        <div className="col-sm">
                            <h5 className='fuente'>Canje en Efectivo</h5>
                            <p>Por cada punto acumulado podes realizar el canje por dinero en efectivo.</p>
                            <p className='text-uppercase'>Valor del punto: </p><span className='text-success font-weight-bold'>$ {company[0].pricePoint}</span>
                        </div>
                        
                        {!sessionStorage.userId && (
                        <div className="col-sm text-danger">
      
                        Para crear una recomendación debes Iniciar Sesión
                                
                        </div>)}
                        {sessionStorage.userId && (
                        <div className="col-sm">
                                
                        <NavLink to={`/companies/${companyId}/recommendation`}><button className="btn btn-warning">Crear Recomendación</button></NavLink>
                                
                        </div>
                        
                        )}
                            
                        </div>
                    </div>
                
                  
            </>
        
    )
    
    }
    </>
    )
}
export default Company;