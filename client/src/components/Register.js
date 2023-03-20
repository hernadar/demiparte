import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom"
import bcrypt from "bcryptjs-react";

function Register() {

    const [errorMessages, setErrorMessages] = useState({});

    const [users, setUsers] = useState([])
    useEffect(() => {

        fetch('/api/users')
            .then(response => response.json())
            .then(users => {
                setUsers(users.data)
            })
            .catch(function (e) {
                console.log(e)
            })
    }, [])
    const navigate = useNavigate()
    const errors = {
        email: "El usuario ya está registrado",
        password: "El password no coincide",
        largopass: "El password tiene que tener al menos ocho caracteres"
    };

    const handleSubmit = (event) => {
        //Prevent page reload
        event.preventDefault();

        var { firstname, lastname, phone, email, password, passwordConfirm, image, privileges } = document.forms[0];
        // Find user login info
        const userData = users.find((user) => user.email === email.value);

        if (!userData) {
                if(password.value===passwordConfirm.value) {
                    
                    if(password.value.length>7){
                         password=password.value
                        // if(privileges.value==="2") {
                        //      privileges_id=2
                        // } else { var privileges_id=1}
                        var formData=new FormData();
                        var fileField=image.files[0];
                        var nombre=firstname.value;
                        var apellido=lastname.value;
                        var telefono=phone.value;
                        var correo=email.value;
                        var passString=toString(password.value)
                        var privileges_id =privileges.value 
                    
                    formData.append('name',nombre);
                    formData.append('lastname',apellido);
                    formData.append('phone',telefono);
                    formData.append('email',correo);
                    formData.append('password',bcrypt.hashSync(passString,10));
                    formData.append('image',fileField);
                    formData.append('privileges_id',privileges_id);
                    
                    fetch('/api/users/register',{
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


                        navigate("/users/login")}
                    else{
                        setErrorMessages({ name: "largopass", message: errors.largopass });
                    }
                } else {
                    // Invalid password Comfirm
                setErrorMessages({ name: "password", message: errors.password });
                }
                


               
            
            }
         else {
            // Usuario ya existente
            setErrorMessages({ name: "email", message: errors.email });
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
                    <h2>Formulario de registro de usuario</h2>

                    <form onSubmit={handleSubmit} action="/user/register" >
                        <div className="row">
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Nombre:</b></label>
                                    <input
                                        type="text"
                                        name="firstname"
                                        className="form-control" required
                                    />

                                    <div className="text-danger">

                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Apellido:</b></label>
                                    <input
                                        type="text"
                                        name="lastname"
                                        className="form-control"required
                                    />

                                    <div className="text-danger">

                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Teléfono:</b></label>
                                    <input
                                        type="text"
                                        name="phone"
                                        className="form-control" required
                                    />

                                    <div className="text-danger">

                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Correo electrónico:</b></label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control" required
                                    />

                                    <div className="text-danger">
                                        {renderErrorMessage("email")}
                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Password:</b></label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control" required
                                    />

                                    <div className="text-danger">
                                        {renderErrorMessage("largopass")}
                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Confirmar Password:</b></label>
                                    <input
                                        type="password"
                                        name="passwordConfirm"
                                        className="form-control" required
                                    />

                                    <div className="text-danger">
                                        {renderErrorMessage("password")}
                                    </div>  

                                </div>
                            </div>
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Imagen de perfil:</b></label>
                                    <input
                                        type="file"
                                        name="image"
                                        className="form-control"
                                    />

                                    <div className="text-danger">

                                    </div>

                                </div>
                            </div>

                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Usuario de Empresa</b></label>
                                    <label className='text-danger'>(Tilde esta casilla SOLO si es una Empresa que recibe recomendaciones)</label>
                                    <input
                                        type="checkbox"
                                        name="privileges"
                                        value="2"
                                        
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
    )
}

export default Register