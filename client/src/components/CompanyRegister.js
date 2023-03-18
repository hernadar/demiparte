import React from 'react';

function CompanyRegister() {
    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <h2>Formulario de registro de Empresa</h2>

                    <form method="POST" action="/user/register" enctype="multipart/form-data">
                        <div className="row">
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Nombre de Empresa:</b></label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                    />

                                    <div className="text-danger">

                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Rubro:</b></label>
                                    <input
                                        type="text"
                                        name="area"
                                        className="form-control"
                                    />

                                    <div className="text-danger">

                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Descripcion:</b></label>
                                    <input
                                        type="text"
                                        name="description"
                                        className="form-control"
                                    />

                                    <div className="text-danger">

                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Precio del punto de recomendación:</b></label>
                                    <input
                                        type="text"
                                        name="pricePoint"
                                        className="form-control"
                                    />

                                    <div className="text-danger">

                                    </div>

                                </div>
                            </div>
                            
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>logo de la Empresa:</b></label>
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
                                <button type="submit" className="btn btn-warning">Registrar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CompanyRegister