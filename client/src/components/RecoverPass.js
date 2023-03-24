import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { useNavigate } from "react-router-dom"
import '@fontsource/public-sans';
import CircularProgress from '@mui/joy/CircularProgress';
import bcrypt from "bcryptjs-react";

function RecoverPass() {

    const [errorMessages, setErrorMessages] = useState({});
 
    const [users, setUsers] = useState([])

    const [code, setCode] = useState(0);
    const [emailSent, setEmailSent] = useState(false);

 

    useEffect(() => {

        fetch('/api/users')
            .then(response => response.json())
            .then(users => {
               
                setUsers(users.data)
            })
            .catch(function (e) {
                console.log('la consulta devolvió un error')
                console.log(e)
            })
    }, [])
 
    const navigate = useNavigate(); 

    const errors = {
        email: "Usuario no registrado",
        codigo: "El código no coincide",
        password: "El password no coincide",
        largopass: "El password tiene que tener al menos ocho caracteres"    };
    
   



    const handleSubmit = (event) => {
        //Prevent page reload
        event.preventDefault();
        var { Email, codigo, password, passwordConfirm } = document.forms[0];
if (!emailSent){


    function codigoAleatorio(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
      }


 // Find user to recover password
        const userDB = users.find((user) => user.email === Email.value);
        var codigoPass = codigoAleatorio(10000,99999)
        setCode(codigoPass)
        var templateParams = {
            from_name:'demiparte.com.ar',
            to_name: userDB.name,
            message: 'Para recuperar tu contraseña debes ingresar este código en la página de Recuperación de Contraseña',
            codigo: codigoPass,
            customer_name: userDB.email
        };
        var publicKey='5M1qiq6zoHBJ9d6Cg'
        emailjs.send('service_nwp3u8g', 'template_p18zcky', templateParams, publicKey)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
            }, function (error) {
                console.log('FAILED...', error);
            });
        setEmailSent(true)

    } else {
        console.log(code)
        
        if(parseInt(codigo.value) === code) {
            if(password.value === passwordConfirm.value){
                if(password.value.length > 7) {
                    password = password.value
                    
                    var formData = new FormData();
                    
                    var correo = Email.value;
                    var passString = toString(password.value)
                    
                    formData.append('email', correo);
                    formData.append('password', bcrypt.hashSync(passString, 10));
                    

                    fetch('/api/users/recoveryPass', {
                        method: 'POST',
                        body: formData
                    })
                        .then(response => response.json())
                        .then(respuesta => {
                            console.log(respuesta)
                          
                        })
                        .catch(function (e) {
                            console.log(e)
                        })

                        navigate("/users/login");

                } else {
                    setErrorMessages({ name: "largopass", message: errors.largopass });
                }
            } else {
                // Invalid password Comfirm
                setErrorMessages({ name: "password", message: errors.password });
            }
        } else {
            // Invalid code
            setErrorMessages({ name: "codigo", message: errors.codigo });
        }

    }
        // var { email, password } = document.forms[0];
        // // Find user login info
        // const userDB = users.find((user) => user.email === email.value);
       
       
        // let passString=toString(password.value)
        // if (userDB) {
        //     if (bcrypt.compareSync(passString, userDB.password)) {

  
        //         sessionStorage.setItem('userId',userDB.id)
        //         sessionStorage.setItem('userImage',userDB.image)
        //         sessionStorage.setItem('userPrivilege',userDB.privileges_id)
        //         window.location.replace('/');
                
        //     } else {
        //         // Invalid password
        //         setErrorMessages({ name: "password", message: errors.password });
        //     }
        // } else {
        //     // Username not found
        //     setErrorMessages({ name: "email", message: errors.email });
        // }
    };

    // Generate JSX code for error message
    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="text-danger">{errorMessages.message}</div>
        );
   console.log(code)
return (

<>      
        {users.length===0 && <div className="row justify-content-center mt-5">
                                    <CircularProgress  />
                                </div>}
         {users.length!==0 &&(
        
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <h2>Recuperación de Contraseña</h2>
                    <form onSubmit={handleSubmit}>

                        <div className="row">
                            <div className="col-md-6 my-2">
                                <div className="form-group">
                                    <label><b>Correo electrónico:</b></label>
                                    <input type="text" name="Email" className="form-control" required />
                                    <div className="text-danger">
                                        {renderErrorMessage("email")}
                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 my-2">
                                <div className="form-group">
                                    
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
                                <label className="form-check-label">
                                       Recibiras un email con un código que debes colocar aquí
                                    </label>
                                </div>
                            </div>
                            {emailSent===true && (
                                <>
                                <div className="col-md-6 my-2">
                                <div className="form-group">
                                    <label><b>Codigo:</b></label>
                                    <input type="text" name="codigo" className="form-control" required />
                                    <div className="text-danger">
                                        {renderErrorMessage("codigo")}
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
                            </>)}
                            {emailSent===false && (
                            <div className="col-12 my-3">
                                <button type="submit" className="btn btn-warning" >Enviar Email</button>
                            </div>
                            )}
                            {emailSent===true && (
                            <div className="col-12 my-3">
                                <button type="submit" className="btn btn-warning" >Cambiar Contraseña</button>
                            </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
   
       )}
 </>   
        )

    
}
export default RecoverPass;