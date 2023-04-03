
import React from 'react';



//const imagenes = require.context('../../../public/images',true)

function Product({ products }) {
    
  

    return (
        <>
            {products.length === 0 && <p>Cargando...</p>}
            {products.map((product, i) => {


                return (


                    <div key={product.id} className="col-sm-5 col-md-3 col-lg-2 mb-4 mx-2">
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

     
                )

            })}
        </>
    )


}

export default Product;