import React from 'react';
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Products from './Products'



function ProductsList(company){
    const [products,setProducts] = useState([])
    const { companyId } = useParams()
    
    useEffect(() =>{
      
        fetch('/api/companies/'+ companyId + '/products/')
        .then (respuesta => {
            return respuesta.json()
        })
        .then (products => {
           
            setProducts(products.data)
        })
        .catch (error => console.log(error))// busca en la base de datos con then, pero ahora lo hago manual
     
    },[companyId]) 

return(
    <div className='container'>
        <div className="row">
    <Products products={products} />
        </div>
    </div>
    )
}

export default ProductsList;





