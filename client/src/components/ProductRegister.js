import React, { useState, useEffect } from 'react';
import {useNavigate, useParams } from "react-router-dom";

function ProductRegister() {
    const { companyId } = useParams()
    const [errorMessages, setErrorMessages] = useState({});
    
    const [products, setProducts] = useState([])

    useEffect(() => {

        fetch('/api/companies/'+ companyId + '/products')
            .then(response => response.json())
            .then(productos => {
                setProducts(productos.data)
            })
            .catch(function (e) {
                console.log(e)
            })
    }, [companyId])

    const errors = {
        name: "Ya existe un producto con ese nombre",
        
    };
    const navigate = useNavigate()
    



    const handleSubmit = (event) => {
        //Prevent page reload
        event.preventDefault();

        var { n_ame, description, category, price, points, image } = document.forms[0];
        // Find product info
        const productData = products.find((product) => product.name === n_ame.value);

        if (!productData) {
                
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
                    
                    
                    fetch('/api/companies/' + companyId +'/products/register',{
                        method:'POST',
                        body: formData
                        })
                        .then(response => response.json())
                        .then(respuesta => {
                            console.log(respuesta)
                         })
                        .catch(function (e) {
                            console.log(e)
                        })


                        navigate("/companies/" + companyId )}
                               
            
         
         else {
            // Producto ya existente
            setErrorMessages({ name: "name", message: errors.name });
        }
    };

  // Generate JSX code for error message
    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="text-danger">{errorMessages.message}</div>
        );




    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <h2>Formulario de registro de Producto</h2>

                    <form onSubmit={handleSubmit} action="" >
                        <div className="row">
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Nombre de Producto:</b></label>
                                    <input
                                        type="text"
                                        name="n_ame"
                                        className="form-control"
                                    />

                                    <div className="text-danger">
                                        {renderErrorMessage("name")}
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
                                    />

                                    <div className="text-danger">

                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Precio:</b></label>
                                    <input
                                        type="text"
                                        name="price"
                                        className="form-control"
                                    />

                                    <div className="text-danger">

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
                                <button type="submit" className="btn btn-warning">Registrar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProductRegister