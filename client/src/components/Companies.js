import React from 'react';
import CompaniesList from './CompaniesList';
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom';


function Companies() {
    const [companies, setCompanies] = useState([])
    useEffect(() => {

        // busca en la base de datos con then, pero ahora lo hago manual
        fetch('/api/companies')
            .then(response => response.json())
            .then(companies => {
                setCompanies(companies.data)

            })
    }, [])

   
    return (
        <>
            <div className='container ml-0'>
                <div className="row ">
                  
                        {companies.map((company, i) => {

                            return (
                                
                                <NavLink className='nav-link' to={`/companies/${company.id}`}>

                                    <CompaniesList key={company.id} company={company} />
                                </NavLink>)
                                
                        })}
             
                    </div>
                </div>
            

        </>
    )
}

export default Companies;