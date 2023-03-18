import React from 'react';
import image from '../assets/images/app/fondo.png'


function Home() {
    return (
        <React.Fragment>

            {/*<!-- Content  -->*/}
            <div className="contenedor">
                <figure>
                    <img src={image} alt="Pesentacion" />
                    <div className="capa">
                        <h5>Cuando recomendas sumas puntos que los podes canjear por productos, servicios o MONETIZARLOS.</h5>

                    </div>
                </figure>
            </div>
            <div className="contenedor">
                <div className='pasos'>
                    <h5 className='ml-1' >Solo tenés que seguir estos pasos:</h5>
                </div>
                <div>
                    <ol >
                        <li>Te creas un usuario en nuestro sitio</li>
                        <li>Elejí la Empresa que queres recomendar</li>
                        <li>Crea tu recomendación</li>
                        <li>Y listo... ya se la podes enviar a quien vos quieras !!!</li>
                    </ol>
                </div>
            </div>


        </React.Fragment >
    )
}



export default Home