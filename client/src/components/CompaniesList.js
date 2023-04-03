import React from 'react';
import { useState, useEffect } from 'react'



function CompaniesList({ company }) {
    const [recommendations, setRecommendations] = useState([])
    const [isLoaded,setIsLoaded] =useState(false)
    useEffect(() => {

        fetch('/api/companies/' + company.id + '/recommendation')
            .then(response => response.json())
            .then(recomendaciones => {
                setRecommendations(recomendaciones.data)
            })
            .catch((err) => {
                console.log(err)
            })

    }, [isLoaded, company.id])
                        
            if (isLoaded===false) {
                setIsLoaded(true)
            }
    return (


        <React.Fragment key={company.id} >
            <div className='col mx-auto '>
                <div  className='card tarjeta p-1 '>

                    
                    
                    <img className="rounded mx-auto d-block" width={100} height={100} src={company.image} alt="Companyimage" />
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