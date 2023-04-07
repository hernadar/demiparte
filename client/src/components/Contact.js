import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"

import emailjs from 'emailjs-com';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'

function Contact() {

    const [show, setShow] = useState(false);
   
    const navigate = useNavigate()

    const handleClose = () => {
        setShow(false)
        navigate("/")
        };
    const handleShow = () => {
        setShow(true)
        };
    

    const handleSubmit = (event) => {
        //Prevent page reload
        event.preventDefault();

        var { firstname, lastname, phone, email, comment } = document.forms[0];
        var info = firstname.value + ' ' + lastname.value + ' ' + phone.value + ' ' + email.value + ' ' + comment.value
        var templateParams = {
            
            to_name: 'Soporte',
            message: info ,
            
            customer_name: 'dario.hernandez@gmail.com'
        };
        var publicKey='5M1qiq6zoHBJ9d6Cg'
        emailjs.send('service_nwp3u8g', 'template_p18zcky', templateParams, publicKey)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
            }, function (error) {
                console.log('FAILED...', error);
            });
            handleShow();
         }


    return (
        <>
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <h2>Formulario de Contacto</h2>

                    <form onSubmit={handleSubmit} action="/user/register" >
                        <div className="row">
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Nombre:</b></label>
                                    <input
                                        type="text"
                                        name="firstname"
                                        placeholder='Ej. Juan'
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
                                        placeholder='Ej. Perez'
                                        className="form-control" required
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
                                        placeholder='Ej. 0261-1234567'
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
                                        placeholder='Ej. juanperez@gmail.com'
                                        className="form-control" required
                                    />

                                    <div className="text-danger">
                                     
                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Comentarios:</b></label>
                                    <textarea
                                        type="text"
                                        name="comment"
                                        placeholder='Cuéntanos el motivo de tu contacto'
                                        className="form-control" required
                                    />

                                    <div className="text-danger">
                                      
                                    </div>

                                </div>
                            </div>
 

                            <div className="col-12 my-3">
                                <button type="submit" className="btn btn-warning">Enviar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
                <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Contacto</Modal.Title>
                </Modal.Header>
                <Modal.Body>Tu información ha sido enviada correctamente, a la brevedad nos contactaremos! Muchas gracias por tu contacto!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" onClick={handleClose}>
                    Aceptar
                </Button>
                
                </Modal.Footer>
            </Modal>
    </>
    
    )
}

export default Contact