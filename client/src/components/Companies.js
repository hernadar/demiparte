import React from 'react';
import CompaniesList from './CompaniesList';
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import '@fontsource/public-sans';
import CircularProgress from '@mui/joy/CircularProgress';

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
        <> {companies.length === 0 && <div className="row justify-content-center mt-5">
                                            <CircularProgress />
                                        </div>}
            {companies.length !== 0 && (
                <div className='container ml-0'>
                    <div className="row ">

                        {companies.map((company, i) => {

                            return (

                                <NavLink key={company.id} className='nav-link' to={`/companies/${company.id}`}>

                                    <CompaniesList key={company.id} company={company} />
                                </NavLink>)

                        })}

                    </div>
                </div>

            )}
        </>
    )
}

export default Companies;