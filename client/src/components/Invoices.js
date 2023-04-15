import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import CircularProgress from '@mui/joy/CircularProgress';
import Select from 'react-select'
function Invoices() {


    const [companies, setCompanies] = useState([])
    const [recommendations, setRecommendations] = useState([]);
    const [invoiceDetail, setInvoiceDetail] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [invoicesFilter, setInvoicesFilter] = useState([]);
    const [billingBeteewnDates, setBillingBeteewnDates] = useState([])
    const [company, setCompany] = useState(null);
    const [companyId, setCompanyid] = useState(null);
    const [facturado, setFacturado] = useState(false);
    const [confirmPay, setConfirmPay] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        //Busco en la DB las empresas a facturar y sus recomendaciones confirmadas o canjeadas

        const recomendacionesConfirmadas = fetch('/api/companies/recommendation/billing')
            .then(response => response.json())
        const empresas = fetch('/api/companies')
            .then(response => response.json())
        const detalleFacturas = fetch('/api/companies/invoices/detail')
            .then(response => response.json())
        const facturas = fetch('/api/companies/invoices/')
            .then(response => response.json())
        Promise.all([recomendacionesConfirmadas, empresas, detalleFacturas, facturas]).then(results => {
            // aquí obtenemos un array con los resultados de cada promesa
            const [recomendacionesConfirmadas, empresas, detalleFacturas, facturas] = results

            setCompanies(empresas.data)
            setRecommendations(recomendacionesConfirmadas.data)
            setInvoiceDetail(detalleFacturas.data)
            setInvoices(facturas.data)
            setIsLoading(false)
        })
       
    }, [])

    const handleSelectCompany = ({ value }) => {

        setCompanyid(value)
    }

    const navigate = useNavigate()
    const invoiceCreate = () => {
        // Armar string con los datos de las recomendaciones confirmadas para enviar
        setIsLoading(true)
        const billingJSON = JSON.stringify(billingBeteewnDates)
 




        fetch('/api/companies/' + company[0].id + '/billing', {
            method: 'POST',
            body: billingJSON,
            headers: {                              // ***
                "Content-Type": "application/json"    // ***
            }
        })
            .then(response => response.json())
            .then(respuesta => {
                window.location.reload()
            })
            .catch(function (e) {
                console.log(e)
            })
    }

    const findInvoices = () => {
        
        let facturasEmpresa = invoices.filter(detalle => detalle.companies_id == companyId)
        let empresa = companies.find(empresa => empresa.id == companyId)
        setCompany([empresa])
        setInvoicesFilter(facturasEmpresa)
        
    }
    const handleSubmit = (event) => {
        //Prevent page reload
        event.preventDefault();
        setFacturado(false)
        var { from, to } = document.forms[0];
        // encontrar empresa seleccionada
        const company = companies.filter((empresa) => { return empresa.id == companyId });
        // seteo la empresa en la variable company
        setCompany(company)
        //filtro las recomendaciones de la empresa seleccionada entre las fechas solicitadas
        const billingBeteewnDates = recommendations.filter((recomendacion) => {
            return ((recomendacion.date >= from.value && recomendacion.date <= to.value) && recomendacion.companies_id == company[0].id)
        });
      
        //seteo esas recomendaciones en la variable billingBeteewnDate
        setBillingBeteewnDates(billingBeteewnDates);
     
    }


    const confirmarPago = () => {
        setConfirmPay(true)
     }

     const enviarPago = (id) => { 
        setIsLoading(true)
        var { datePay } = document.forms[1];
        var dia ={
            datePay : datePay.value,
        }
       
        const diaJSON = JSON.stringify(dia);
        
        fetch('/api/companies/invoices/' + id, {
            method: 'POST',
            body: diaJSON,
            headers: {                              // ***
                "Content-Type": "application/json"    // ***
            }
            
        })
        .then(response => response.json())
        .then(respuesta => {
            window.location.reload()
            })
            .catch(function (e) {
                console.log(e)
            })
            
          
        }
    
   
    return (
        <>
        
        {isLoading ? (<div className="row justify-content-center mt-5">
                        <CircularProgress />
                    </div>):
        (<div>
       
       
            {(companies.length === 0) &&
                <>
                    <div className="row justify-content-center mt-5">
                        <CircularProgress />
                    </div>
                </>}
            {(companies.length !== 0) && (
                    <>
                    <div className="container my-5">
                        <div className="row justify-content-center">
                            <div className="col-md-10">
                                <h2>Facturación</h2>

                                <form onSubmit={handleSubmit} >
                                    <div className="my-1">
                                        
                                            <label><b>Empresa:</b></label>



                                            <Select
                                                options={companies.map(empresa => ({
                                                    label: empresa.name,
                                                    value: empresa.id
                                                }))}
                                                onChange={handleSelectCompany}
                                            />

                                            <div className="col-sm m-1">
                                                <button onClick={findInvoices} className="btn btn-warning">Buscar Facturas</button>
                                            </div>
                                            {invoicesFilter.length !== 0 && (
                                                <>
                                                    <div className="table-responsive">
                                                        <table className="table table-sm shadow " >
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">#</th>
                                                                    <th scope="col">F. Emisión</th>
                                                                    <th scope="col">F. Pago</th>
                                                                    <th scope="col">Empresa</th>
                                                                    <th scope="col">Estado</th>
                                                                    <th scope="col">Total</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>


                                                                {invoicesFilter.map((factura, i) => {
                                                                    let dateCorrection1 = factura.dateCreate + 'T00:00:00';
                                                                    let fechaEmision = new Date(dateCorrection1).toLocaleDateString('es-AR')
                                                                    if (factura.datePay === null) {

                                                                    } else {
                                                                        let dateCorrection2 = factura.datePay + 'T00:00:00';
                                                                        var fechaPago = new Date(dateCorrection2).toLocaleDateString('es-AR')
                                                                    }

                                                                    return (
                                                                        <tr key={factura.id}>
                                                                            <th scope="row">{factura.id}</th>
                                                                            <td>{fechaEmision}</td>
                                                                            <td>{fechaPago}</td>
                                                                            <td>{company[0].name}</td>
                                                                            <td>{factura.status}</td>
                                                                            <td>$ {factura.total}</td>
                                                                            {(factura.datePay === null) && <td><button className="btn btn-warning" onClick={confirmarPago}>Pagar</button></td>}
                                                                            {((factura.datePay === null) && confirmPay) && (
                                                                                 <div>
                                                                                     <form>   
                                                                                     <input type='date' name='datePay'/>
                                                                                     </form>
                                                                                     <button className="btn btn-warning m-1"  onClick={()=>enviarPago(factura.id)}>Confirmar</button>
                                                                               
                                                                             </div>
                                                                            )}
                                                                        </tr>
                                                                    )
                                                                })}




                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </>)}
                                        
                                    </div>


                                    {recommendations.length !== 0 && (
                                        <>
                                            <hr className="sidebar-divider " />
                                            <div className='row justify-content-around'>
                                                <label >Facturar</label>

                                            </div>
                                            <div className='row justify-content-around'>
                                                <label >Desde: </label>
                                                <input name="from" type="date"></input>
                                            </div>
                                            <div className='row justify-content-around'>
                                                <label >Hasta: </label>
                                                <input name="to" type="date"></input>
                                            </div>
                                            <div className="col-sm m-1">
                                                <button type="submit" className="btn btn-warning">Buscar Recomendaciones</button>
                                            </div>
                                        </>)}
                                    {billingBeteewnDates.length !== 0 && (
                                        <>
                                            <div className="table-responsive">
                                                <table className="table table-sm shadow " >
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">#</th>
                                                            <th scope="col">Fecha</th>
                                                            <th scope="col">Estado</th>
                                                            <th scope="col">Precio</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {billingBeteewnDates.map((pago, i) => {
                                                            let dateCorrection = pago.date + 'T00:00:00';
                                                            let fecha = new Date(dateCorrection).toLocaleDateString('es-AR')
                                                            // verifico si la recomendación actual está factura y la marco
                                                            // para eso la debo buscar en invocieDetail
                                                            
                                                            var fact=""
                                                            for (let i=0; i< invoiceDetail.length; i++){
                                                                
                                                                if (invoiceDetail[i].status_id == pago.id){
                                                                    if(facturado === false){setFacturado(true)}
                                                                    var fact='Facturado'
                                                                
                                                                }
                                                            }
                                                            return (
                                                                
                                                                <tr key={pago.id}>
                                                                    <th scope="row">{pago.id}</th>
                                                                    <td>{fecha}</td>
                                                                    <td>{pago.status}</td>
                                                                    <td>$ {company[0].pricePoint * company[0].fee}</td>
                                                                    <td>{fact}</td>
                                                                </tr>
                                                            )
                                                        })}

                                                    </tbody>
                                                </table>
                                            </div>
                                            <div>
                                                <label>Total: $ {billingBeteewnDates.length * company[0].pricePoint * company[0].fee}</label>

                                            </div>
                                            {!facturado &&
                                                <div className="col-sm m-1">
                                                    <button onClick={invoiceCreate} className="btn btn-warning">Confirmar</button>
                                                </div>}
                                            {facturado &&
                                                <div className="col-sm m-1">
                                                    <label className="text-danger">Existen Items Facturados</label>
                                                </div>}
                                        </>

                                    )}
                                </form>
                            </div>
                        </div >
                    </div>
                  
                </>)
            }

        </div>)} 
        </>)    
}

export default Invoices