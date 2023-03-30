import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom"
import CircularProgress from '@mui/joy/CircularProgress';

function RegisterCompany() {

    const [errorMessages, setErrorMessages] = useState({});

    const [companies, setCompanies] = useState([])
    const [areas, setAreas] = useState([])


    useEffect(() => {

        fetch('/api/companies')
            .then(response => response.json())
            .then(companies => {
                setCompanies(companies.data)
            })
            .catch(function (e) {
                console.log(e)
            })
    }, [])

    useEffect(() => {

        fetch('/api/companies/areas')
            .then(response => response.json())
            .then(areas => {
                setAreas(areas.data)
            })
            .catch(function (e) {
                console.log(e)
            })
    }, [])


    const navigate = useNavigate()
    
    
    const errors = {
        name: "La empresa ya está registrada",
        
    };

    const handleSubmit = (event) => {
        //Prevent page reload
        event.preventDefault();

        var { name, description, image, areas_id, pricePoint } = document.forms[0];
        // Find user login info
        const companyData = companies.find((company) => company.name === name.value);

        if (!companyData) {
               
                        var formData=new FormData();
                        var fileField=image.files[0];
                        var nombre=name.value;
                        var descripcion=description.value;
                        var area=areas_id.value;
                        var precioPunto=pricePoint.value;
                   
                    
                    formData.append('name',nombre);
                    formData.append('description',descripcion);
                    formData.append('image',fileField);
                    formData.append('areas_id', area);
                    formData.append('pricePoint',precioPunto);
                    
                    fetch('/api/companies/register/'+ sessionStorage.userId,{
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


                        navigate("/")}
                               
            
         
         else {
            // Empresa ya existente
            setErrorMessages({ name: "name", message: errors.name });
        }
    };

    // Generate JSX code for error message
    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="text-danger">{errorMessages.message}</div>
        );


    return (
    <>{areas.length === 0 && <div className="row justify-content-center mt-5">
                                    <CircularProgress />
                                </div>}
        {areas.length!==0 &&(
        <>
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <h2>Formulario de registro de Empresa</h2>

                    <form onSubmit={handleSubmit} action="" >
                        <div className="row">
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Nombre:</b></label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control" required
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
                                        className="form-control"required
                                    />

                                    <div className="text-danger">

                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                <label><b>Area/Rubro:</b></label>
                                <select  type="number"
                                        name="areas_id"
                                        className="form-control" required>
                                    { areas.map((area)=>{

                                        return(
                                        <option value={area.id}>{area.name}</option>
                                        )
                                    })}
                                 </select>
                                    
                                    
                                    
                                   
                                    <div className="text-danger">

                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Precio del punto de Recomendación:</b></label>
                                    <input
                                        type="number"
                                        name="pricePoint"
                                        className="form-control" required
                                    />

                                    <div className="text-danger">
                                      
                                    </div>

                                </div>
                            </div>

                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Logo de Empresa:</b></label>
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
                                <button type="submit" className="btn btn-warning">Registrarse</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
    )}
   </> 
        )
}

export default RegisterCompany;