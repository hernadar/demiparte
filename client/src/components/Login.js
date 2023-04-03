import React, { useState, useEffect } from 'react';

import { NavLink } from "react-router-dom"

import bcrypt from "bcryptjs-react";
import '@fontsource/public-sans';
import CircularProgress from '@mui/joy/CircularProgress';

function Login() {

    const [errorMessages, setErrorMessages] = useState({});
 
    const [users, setUsers] = useState([])
    useEffect(() => {

        if(users.length === 0 ){
        fetch('/api/users')
            .then(response => response.json())
            .then(users => {
               
                setUsers(users.data)
            })
            .catch(function (e) {
                console.log('la consulta devolvió un error')
                console.log(e)
            })
            }
    }, [users])
 
    const errors = {
        email: "Usuario no registrado",
        password: "Password incorrecto"
    };

    const handleSubmit = (event) => {
        //Prevent page reload
        event.preventDefault();

        var { email, password } = document.forms[0];
        // Find user login info
        const userDB = users.find((user) => user.email === email.value);
       
       
        let passString=toString(password.value)
        if (userDB) {
            if (bcrypt.compareSync(passString, userDB.password)) {

  
                sessionStorage.setItem('userId',userDB.id)
                sessionStorage.setItem('userImage',userDB.image)
                sessionStorage.setItem('userPrivilege',userDB.privileges_id)
                window.location.replace('/');
                
            } else {
                // Invalid password
                setErrorMessages({ name: "password", message: errors.password });
            }
        } else {
            // Username not found
            setErrorMessages({ name: "email", message: errors.email });
        }
    };

    // Generate JSX code for error message
    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="text-danger">{errorMessages.message}</div>
        );
   
return (

<>      
        {users.length===0 &&    <div className="row justify-content-center mt-5">
                                    <CircularProgress  />
                                </div>}
                                
         {users.length!==0 &&(
        
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <h2>Formulario de Login</h2>
                    <form onSubmit={handleSubmit}>

                        <div className="row">
                            <div className="col-md-6 my-2">
                                <div className="form-group">
                                    <label><b>Correo electrónico:</b></label>
                                    <input type="text" name="email" className="form-control" required />
                                    <div className="text-danger">
                                        {renderErrorMessage("email")}
                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 my-2">
                                <div className="form-group">
                                    <label><b>Password:</b></label>
                                    <input type="password" name="password" className="form-control" required />
                                    <div className="text-danger">
                                        {renderErrorMessage("password")}
                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 my-2">
                                <div className="form-group form-check">
                                    {/* <label className="form-check-label">
                                        <input type="checkbox" className="form-check-input" name="remember_user" />Recordar mi usuario
                                    </label> */}
                                </div>
                            </div>
                            <div className="col-md-6 my-2">
                                <div className="form-group form-check">
                                <NavLink to={`/users/recoverpass`}><span className="form-check-label">
                                        Olvidé mi contraseña
                                    </span> </NavLink>
                                </div>
                            </div>
                            <div className="col-12 my-3">
                                <button type="submit" className="btn btn-warning" >Iniciar Sesión</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
   
       )}
 </>   
        )

    
}
export default Login;