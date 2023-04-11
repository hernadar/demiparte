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
    const [company, setCompany] = useState(null)
    const [companyId, setCompanyid] = useState(null)
    const [facturado, setFacturado] = useState(false)

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
        })

    }, [])

    const handleSelectCompany = ({ value }) => {

        setCompanyid(value)
    }

    const navigate = useNavigate()
    const invoiceCreate = () => {
        // Armar string con los datos de las recomendaciones confirmadas para enviar

        const billingJSON = JSON.stringify(billingBeteewnDates)
        console.log('Este es el JSON de las recomendaciones a facturar:' + billingJSON)
        console.log('este es el Id de empresa:' + company[0].id)




        fetch('/api/companies/' + company[0].id + '/billing', {
            method: 'POST',
            body: billingJSON,
            headers: {                              // ***
                "Content-Type": "application/json"    // ***
            }
        })
            .then(response => response.json())
            .then(respuesta => {
                console.log(respuesta)
            })
            .catch(function (e) {
                console.log(e)
            })
    }

    const findInvoices = () => {
        
        let facturasEmpresa = invoices.find(detalle => detalle.companies_id == companyId)
        let empresa = companies.find(empresa => empresa.id == companyId)
        setCompany(empresa)
       
        if (facturasEmpresa === undefined) {
            setInvoicesFilter([])
        } else {
        
        let arrayFacturas = []
            arrayFacturas.push(facturasEmpresa) 
            setInvoicesFilter(arrayFacturas)
        }
    }
    const handleSubmit = (event) => {
        //Prevent page reload
        event.preventDefault();

        var { from, to } = document.forms[0];
        // encontrar empresa seleccionada

        const company = companies.filter((empresa) => { return empresa.id == companyId });

        setCompany(company)

        const billingBeteewnDates = recommendations.filter((recomendacion) => {
            return (recommendations[0].date >= from.value && recommendations[0].date <= to.value && recomendacion.companies_id == company[0].id)
        });
        console.log(billingBeteewnDates)
        setBillingBeteewnDates(billingBeteewnDates);

        for (let i = 0; i < billingBeteewnDates.length; i++) {
            let facturado = invoiceDetail.find(detalle => detalle.status_id == billingBeteewnDates[i].id)

            if (facturado.length !== 0) {
                setFacturado(true)

            }
        }
    }



    return (
        <>
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
                                    <div className="col-md-6 my-1">
                                        <div className="form-group">
                                            <label><b>Empresa:</b></label>



                                            <Select
                                                options={companies.map(empresa => ({
                                                    label: empresa.name,
                                                    value: empresa.id
                                                }))}
                                                onChange={handleSelectCompany}
                                            />


                                            <div className="text-danger">

                                            </div>

                                        </div>
                                    </div>


                                    {recommendations.length !== 0 && (
                                        <>

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

                                                            return (
                                                                <tr key={pago.id}>
                                                                    <th scope="row">{pago.id}</th>
                                                                    <td>{fecha}</td>
                                                                    <td>{pago.status}</td>
                                                                    <td>$ {company[0].pricePoint * company[0].fee}</td>
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
                                                    <label>Items Facturados</label>
                                                </div>}
                                        </>

                                    )}


                                </form>

                                <div className="col-sm m-1">
                                    <button onClick={findInvoices} className="btn btn-warning">Buscar Facturas</button>
                                </div>
                      
                            </div>
                    
                        </div >


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
                                                                let dateCorrection2 = factura.datePay + 'T00:00:00';
                                                                let fechaEmision = new Date(dateCorrection1).toLocaleDateString('es-AR')
                                                                let fechaPago = new Date(dateCorrection2).toLocaleDateString('es-AR')
                                                                return (
                                                                    <tr key={factura.id}>
                                                                        <th scope="row">{factura.id}</th>
                                                                        <td>{fechaEmision}</td>
                                                                        <td>{fechaPago}</td>
                                                                        <td>{company.name}</td>
                                                                        <td>{factura.status}</td>
                                                                        <td>$ {factura.total}</td>
                                                                    </tr>
                                                                )
                                                            })}
                                                    



                                                </tbody>
                                            </table>
                                        </div>
                                    </>)}   
                    </div >

                </>)
            }

        </>)
}

export default Invoices