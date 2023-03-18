import React from 'react'
import styled from 'styled-components'


function Modal({children, estado, cambiarEstado} ) {


    return (
        <>
           {estado &&(
            <Overlay>
                <ContenedorModal>
                    <EncabezadoModal>
                        <h4>Recomendación</h4>
                    </EncabezadoModal>
                    <BotonCerrar onClick={() => cambiarEstado(false)}>X</BotonCerrar>
                    
                       {children}
                       
                </ContenedorModal>
            </Overlay>
         )}
        </>
    )
}

export default Modal;

const Overlay = styled.div`
    width: 100vw;
    height: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.5);

    display: flex;
    justify-content: center;
    padding:20px;
    `

const ContenedorModal = styled.div`
    width:500px;
    height:250px;
    background:#fff;
    top:150px;
    position: relative;
    border-radius: 6px;
    box-shadow: 0px 15px 25px rgba(0,0,0,0.50);
    padding:20 px;
`

const EncabezadoModal = styled.div`
    display: flex;
    align-items: center;
    justify.content: space-between;
    margin-top: 20px;
    margin-left: 20px;
    margin-bottom: 20px;
    padding-botton: 20px;
    border-botton: 1px solid #E8E8E8;

    h3{
        
        color: rgba(100,100,100,0.5)
}`

const BotonCerrar = styled.button`
    position:absolute;
    top: 20px;
    right: 20px;
    border-color: rgba(100,100,100,0.5);
    border: none;
    background: none;
    transition: .3 ease all;
    border-radius: 6 px;
    color:rgba(100,100,100,0.5);

    &:hover{
        background: rgba(235,165,45,0.5);
    }
    `
