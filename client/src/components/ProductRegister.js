import React from 'react';

function ProductRegister() {
    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <h2>Formulario de registro de Producto</h2>

                    <form method="POST" action="/companies/:id/product/register" enctype="multipart/form-data">
                        <div className="row">
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Nombre de Producto:</b></label>
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
                                    <label><b>Descripción:</b></label>
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
                                    <label><b>Categoria:</b></label>
                                    <input
                                        type="text"
                                        name="category"
                                        className="form-control"
                                    />

                                    <div className="text-danger">

                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Precio:</b></label>
                                    <input
                                        type="text"
                                        name="price"
                                        className="form-control"
                                    />

                                    <div className="text-danger">

                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Cantidad de puntos para canje:</b></label>
                                    <input
                                        type="text"
                                        name="points"
                                        className="form-control"
                                    />

                                    <div className="text-danger">

                                    </div>

                                </div>
                            </div>
                            <div className="col-md-6 my-1">
                                <div className="form-group">
                                    <label><b>Imagen:</b></label>
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

export default ProductRegister