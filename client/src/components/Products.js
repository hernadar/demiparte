
import React, { useState } from 'react';
import {useNavigate, NavLink } from "react-router-dom"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'



function Product({ products, userCompany }) {
    const [empresa,setEmpresa]= useState('')
    const [productId,setproductId]= useState('')
    const [show, setShow] = useState(false);
    const navigate = useNavigate()
    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        if (productId ===''){
          setproductId(id)  
        }
        setShow(true)};
    const handleEliminate = () => {
        const productsJSON = JSON.stringify(productId)
        
  
        fetch('/api/companies/' + empresa + '/products/delete/' + productId,
        {
            method: 'POST',
            
        })
        .then(response => response.json())
            .then(productos => {
             
            })
            .catch(function (e) {
                console.log(e)
            })
        console.log('se eliminó producto:' + productId)
        
        setShow(false);
        setTimeout(()=>{
            navigate("/companies/")
        },2000)
    }
   
   
   
    if(userCompany.userCompany.length !== 0)
    if (empresa ===''){
    setEmpresa(userCompany.userCompany[0].companies_id)
    }
    return (
        <>
        
            {products.length === 0 && <p>Cargando...</p>}
   
            {products.map((product, i) => {


                return (
                    <>
                    <div className="col-sm-5 col-md-3 col-lg-2 mb-4 mx-2 justify-content-around">
                    <div className = "column">
                    {(userCompany && sessionStorage.userId && (sessionStorage.userPrivilege === '2' || sessionStorage.userPrivilege === '3')) && <NavLink  className='nav-link' to={`/companies/${empresa}/product/edit/`+ product.id}><button className="btn btn-warning btn-sm ">Editar</button></NavLink>}
                    {(userCompany && sessionStorage.userId && (sessionStorage.userPrivilege === '2' || sessionStorage.userPrivilege === '3') && product.name !== 'Dinero' ) && <button className="btn btn-warning btn-sm m-1" onClick={() => handleShow(product.id)}>Eliminar</button>}
                    </div>
                    <div key={product.id} className="">
                        <div className='card tarjeta  h-100 '>
                            <div className="card-body">
                                <div className="no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div className='text-xs  mb-1 text-center'>
                                            <em>Puntos: </em><em className='font-weight-bold text-lg text-warning'>{product.points}</em>
                                        </div>

                                    </div>

                                    <div className="col-auto">
                                    <img className=" rounded mx-auto d-block w-100" src={product.image} alt="productImage" />
                                        <div className='text-xs font-weight-bold  text-center '>{product.name}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
        
                    </div> </>    
                )

            })}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Eliminar</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Seguro desea eliminar el producto?
                    Tenga en cuenta que si existen canjes asociados a él, también se perderán
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                    <Button variant="warning" onClick={handleEliminate}>
                    Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
               </>
    )


}

export default Product;