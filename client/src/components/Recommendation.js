import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from "qrcode.react";
import bcrypt from "bcryptjs-react";
import Modal from "./Modal";
import styled from 'styled-components';
import emailjs from 'emailjs-com';
import '@fontsource/public-sans';
import CircularProgress from '@mui/joy/CircularProgress';



function Recommendation() {

    const { companyId } = useParams()
    const [user, setUser] = useState([])
    const [company, setCompany] = useState([])
    const [keyRecommend, setkeyRecommend] = useState("")
    var [status, setStatus] = useState("")
    const [errorMessages, setErrorMessages] = useState({});
    var [estadoModal, setEstadoModal] = useState(false);
    var [imageURL, setImageURL] = useState("");


    const errors = {
        recomendacion: "La recomendación ya fue generada, no puedes generar más de una recomendación por empresa, la misma la puedes compartir cuantas veces quieras",
    };

  


    useEffect(() => {

        // recupero el Id de usuario de la sesión para buscar el resto de datos del usuario
        let userId = sessionStorage.getItem('userId')
        // Verifico si aún no se ha solicitado los datos de usuario y los solicito        
        if (keyRecommend === "") {
            fetch('/api/users/profile/' + userId)
                .then(response => response.json())
                .then(usuario => {
                    setUser(usuario.data)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [user,keyRecommend])
    // Verifico si aún no se ha solicitado los datos de empresa y los solicito 
    useEffect(() => {
        if (keyRecommend === "") {
            fetch('/api/companies/profile/' + companyId)
                .then(response => response.json())
                .then(empresa => {
                    setCompany(empresa.data)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [companyId, keyRecommend])


    // Este useEffect está pendiente de que se actualicen las variables
    // que contenen los datos de usuario y empresa para recién en ese momento
    // generar el código que identifica la recomendación
    useEffect(() => {

        if (user.length !== 0 && company.length !== 0) {
            let code = user[0].name + user[0].lastname + company[0].name
            let codeString = toString(code);
            let key = bcrypt.hashSync(codeString, 10)
            setkeyRecommend(key)
        }
    }, [user, company])
// Este hook está pendiente de la variable imageURL para que cuando esté lista la image Base64 la envía por mail
    useEffect(() =>{
       
        // console.log(imageURL)
        if(imageURL!=="") {

        var templateParams = {
            from_name:'demiparte.com.ar',
            to_name: user.name,
            message: 'Ya está disponible tu recomendación, podes consultar su estado en tu perfil http://demiparte.com.ar',
            // image:'<div> <img src='+imageURL+'></div>',
            customer_name: user.email
        };
        var publicKey='5M1qiq6zoHBJ9d6Cg'
        emailjs.send('service_nwp3u8g', 'template_n7jmtcw', templateParams, publicKey)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
            }, function (error) {
                console.log('FAILED...', error);
            });
        }
    }, [imageURL, user.email, user.name])

    const downloadRecomendacion = () =>{
        html2canvas(recomendacion.current) // Llamar a html2canvas y pasarle el elemento
        .then(canvas => {
            // Cuando se resuelva la promesa traerá el canvas
            setImageURL(canvas.toDataURL())
            
            // Crear un elemento <a>
           
            let enlace = document.createElement('a');
            enlace.download = `Recomendacion${company.name}`;
            // Convertir la imagen a Base64
            
            enlace.href = canvas.toDataURL('image/png', 0.1);
            // Hacer click en él
             
    
            enlace.click();
           
        });
         
        setEstadoModal(true);
    }

    const recomendacion = useRef(); // include this: call the useRef function

    // función que genera la recomendación en la DB
    const createRecommendation = (e) => {
        //Preparo los datos para enviar
        e.preventDefault()
        
        if (status === "") {
           
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let dateToCreate = year + '-' + month + '-' + day
            let recommendationToCreate = {
                users_id: user[0].id,
                companies_id: company[0].id,
                code: keyRecommend,
                dateCreate: dateToCreate,
                status: 'creada'
            }
            
            
            fetch('/api/users/recommendation/register', {
                method: "POST",
                body: JSON.stringify(recommendationToCreate),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            })
                .then(response => response.json())
                .then(json => {
                  
                   
                })
                .catch(err => console.log(err));
                setStatus('creada') 
                downloadRecomendacion()
               
                
       
       
       
       
       
       
       
       
            } else {
            setErrorMessages({ name: "recomendacion", message: errors.recomendacion });
        }

    }

  

 
    // Generate JSX code for error message
    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="text-danger">{errorMessages.message}</div>
        );



    return (
        <>
            {user.length === 0 && <div className="row justify-content-center mt-5">
                                    <CircularProgress  />
                                </div>}
            {company.length === 0 && <div className="row justify-content-center mt-5">
                                    <CircularProgress  />
                                </div>}
            {keyRecommend === "" && <div className="row justify-content-center mt-5">
                                    <CircularProgress  />
                                </div>}
            {(user.length !== 0 && company.length !== 0 && keyRecommend !== "") && (
                <>
                <div className=' pb-3'>
                    <div ref={recomendacion} className="rounded border sombra row justify-content-around align-items-center border-left-warning m-4" >
                        <div className=" col-sm">
                            <em>Recomiendo a </em><em className='text-warning'>{company[0].name}</em>
                            <img className="w-100 h-50" src={company[0].image} alt="Company" />
                            <div className='text-xs font-weight-bold text-warning text-center '>{user[0].name}   {user[0].lastname}</div>
                        </div>
                        {keyRecommend !== "" && (
                            <div className="col-sm align-middle m-1" >
                                <QRCodeCanvas value={keyRecommend}
                                    id="qrCode"
                                    size={200}
                                />


                            </div>)}
                    </div>
                    <div className="col-sm">
                        <form onSubmit={createRecommendation}>
                            <button className="btn btn-warning" type="submit">Confirmar Recomendación</button>
                            
                        </form>
                        <div className="text-danger">
                        {renderErrorMessage("recomendacion")}
                    </div>

                    </div>
                   
                    </div>

                </>
            )}
    <Modal
        estado={estadoModal}
        cambiarEstado={setEstadoModal}
        >
        <Contenido>
            <p>Se creó la recomendación exitosamente y se descargó en tu dispositvo, ya la podes compartir entre tus amigos y consultar su estado en tu perfil de usuario.</p>
            <BotonAceptar onClick={() => setEstadoModal(false)} >
                Aceptar
            </BotonAceptar>
        </Contenido>
        
    </Modal>

        </>)



}



export default Recommendation

const Contenido = styled.div `
    display:flex;
    flex-direction: column;
    width:90%;
    margin-left: 20px;
    align-items: center;
    p {
        font-size: 18px;
    }`
    const BotonAceptar = styled.button `
display: block;

padding: 10px;
border-radius: 10px;
color: #fff;
border: none;
background:rgba(235,128,19,0.7);
transition: .3s ease all;


&:hover {
    background:rgba(239,135,17,0.9)
}`