import React, { useState, useEffect } from 'react';
import {useNavigate, useParams } from "react-router-dom";
import CircularProgress from '@mui/joy/CircularProgress';

function ProductEdit() {
    const { companyId, productId } = useParams()
    const [errorMessages, setErrorMessages] = useState({});
    
    const [product, setProduct] = useState([])
//UseStat de los imputs
const [nombre, setNombre] = useState('')
const [descripcion, setDescripcion] = useState('')
const [categoria, setCategoria] = useState('')
const [precio, setPrecio] = useState('')
const [puntos, setPuntos] = useState('')

    useEffect(() => {

        fetch('/api/companies/'+ companyId + '/products/edit/' + productId )
            .then(response => response.json())
            .then(producto => {
                setProduct(producto.data)
                setNombre(producto.data[0].name)
                setDescripcion(producto.data[0].description)
                setCategoria(producto.data[0].category)
                setPrecio(producto.data[0].price)
                setPuntos(producto.data[0].points)
            })
            .catch(function (e) {
                console.log(e)
            })
    }, [])

    const errors = {
        price: "Debe utilizar el (.) como separador decimal",
        
    };
    const navigate = useNavigate()
    



    const handleSubmit = (event) => {
        //Prevent page reload
        event.preventDefault();

        var { n_ame, description, category, price, points, image } = document.forms[0];
       
            if(!price.value.includes(',')){  
                        var formData=new FormData();
                        var fileField=image.files[0];
                        var nombre=n_ame.value;
                        var descripcion=description.value;
                        var categoria=category.value;
                        var precio=price.value;
                        var puntos=points.value
                     
                    formData.append('name',nombre);
                    formData.append('description',descripcion);
                    formData.append('category', categoria);
                    formData.append('price',precio);
                    formData.append('points',puntos);
                    formData.append('image',fileField);
                    
                    
                    fetch('/api/companies/' + companyId +'/products/edit/'+ productId,{
                        method:'POST',
                        body: formData
                        })
                        .then(response => response.json())
                        .then(respuesta => {
                          
                         })
                        .catch(function (e) {
                            console.log(e)
                        })

                        setTimeout(()=>{
                            navigate("/companies/")
                        },2000)
                    
                    } else {
                        setErrorMessages({ name: "price", message: errors.price });
                         }    

                               
                    }
         
      
    

  // Generate JSX code for error message
    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="text-danger">{errorMessages.message}</div>
        );




    return (
        <>
            {product.length===0 &&    <div className="row justify-content-center mt-5">
                                    <CircularProgress  />
                                </div>}
                                
         {product.length!==0 &&(

           <> 
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <h2>Formulario de modificación de Producto</h2>

                    <form onSubmit={handleSubmit} action="" >
                        <div className="row">
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Nombre de Producto:</b></label>
                                    <input
                                        type="text"
                                        name="n_ame"
                                        className="form-control"
                                        value={nombre}
                                        onChange={(e)=> setNombre(e.target.value)}
                                    />

                                    <div className="text-danger">
                                        
                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Descripción:</b></label>
                                    <input
                                        type="text"
                                        name="description"
                                        className="form-control"
                                        value={descripcion}
                                        onChange={(e)=> setDescripcion(e.target.value)}
                                   />

                                    <div className="text-danger">

                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Categoria:</b></label>
                                    <input
                                        type="text"
                                        name="category"
                                        className="form-control"
                                        value={categoria}
                                        onChange={(e)=> setCategoria(e.target.value)}
                                    />

                                    <div className="text-danger">

                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Precio:</b></label>
                                    <input
                                        type="number"
                                        name="price"
                                        className="form-control"
                                        value={precio}
                                        onChange={(e)=> setPrecio(e.target.value)}
                                    />

                                   
                                    <div className="text-danger">
                                        {renderErrorMessage("price")}
                                    </div>
                                  

                                </div>
                            </div>
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Cantidad de puntos para canje:</b></label>
                                    <input
                                        type="text"
                                        name="points"
                                        className="form-control"
                                        value={puntos}
                                        onChange={(e)=> setPuntos(e.target.value)}
                                    />

                                    <div className="text-danger">

                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Imagen:</b></label>
                                    <input
                                        type="file"
                                        name="image"
                                        className="form-control"
                                    />

                                    <div className="text-danger">

                                    </div>

                                </div>
                            </div>
                            <div className="col-12 my-3">
                                <button type="submit" className="btn btn-warning">Confirmar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>  )}
    
        </>)
}

export default ProductEdit