import React from 'react';
import { useState, useEffect } from 'react'

const imagenes = require.context('../assets/images/', true)

function CompaniesList({ company }) {
    const [recommendations, setRecommendations] = useState([])
    useEffect(() => {

        fetch('/api/companies/' + company.id + '/recommendation')
            .then(response => response.json())
            .then(recomendaciones => {
                setRecommendations(recomendaciones.data)
            })
            .catch((err) => {
                console.log(err)
            })

    }, [])

    return (


        <React.Fragment key={company.id} >
            <div  className='col mx-auto '>
                <div  className='card tarjeta p-1 '>

                    

                    <img className="rounded mx-auto d-block" width={100} height={100} src={imagenes(`./logos/${company.image}`)} alt="Companyimage" />
                    <div className='capa'>
                        <p className='text-xs '>Total de recomendaciones</p>
                        <p  className="h5 font-weight-bold">{recommendations.length}</p>
                        <p  className='text-xs font-weight-bold  '>{company.name}</p>
                    </div>
                </div>
               


            </div>

        </React.Fragment>
    )

}








export default CompaniesList;