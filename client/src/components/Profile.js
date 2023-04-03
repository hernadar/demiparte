import React from 'react';
import { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas'
import { QRCodeCanvas } from "qrcode.react"
import '@fontsource/public-sans';
import CircularProgress from '@mui/joy/CircularProgress';


function Profile() {
	const [user, setUser] = useState([])
	const [recommendations, setRecommendations] = useState([])
	const [recommendationsPending, setRecommendationsPending] = useState([])



	useEffect(() => {

		// recupero el Id de usuario de la sesión para buscar el resto de datos del usuario
		let userId = sessionStorage.getItem('userId')
		// Verifico si aún no se ha solicitado los datos de usuario y los solicito        
		if (user.length === 0) {
			fetch('/api/users/profile/' + userId)
				.then(response => response.json())
				.then(usuario => {
					setUser(usuario.data)
				})
				.catch((err) => {
					console.log(err)
				})
		}
	}, [user.length])



	const identificacion = useRef(); // include this: call the useRef function
	//Bajar QR
	const downloadQRCode = (e) => {
		e.preventDefault();
		html2canvas(identificacion.current) // Llamar a html2canvas y pasarle el elemento
			.then(canvas => {
				// Cuando se resuelva la promesa traerá el canvas

				// Crear un elemento <a>
				let enlace = document.createElement('a');
				enlace.download = `Identificacion${user.name}${user.lastname}`;
				// Convertir la imagen a Base64
				enlace.href = canvas.toDataURL();
				// Hacer click en él
				enlace.click();
				document.body.removeChild(enlace);
			});
	}
	// busca en la base de datos las recomendaciones que tiene ese usuario

	const recommendationByUser = () => {
		fetch('/api/users/' + user[0].id + '/recommendation/')
			.then(response => response.json())
			.then(recomendaciones => {
				setRecommendations(recomendaciones.data)
			})
			.catch((err) => {
				console.log(err)
			})
	}
	
	const recommendationPendientes = () => {
		fetch('/api/users/' + user[0].id + '/recommendation/present')
			.then(response => response.json())
			.then(recomendaciones => {
				setRecommendationsPending(recomendaciones.data)
			})
			.catch((err) => {
				console.log(err)
			})


	}

	

	return (
		<>
			{user.length === 0 && <div className="row justify-content-center mt-5">
				<CircularProgress />
			</div>}
			{user.length !== 0 && (
				<>

					<div className="container" >
						<div className="row">

							<h2>Hola {user[0].name} </h2>
							<p className=' p-10'>Esta es tu identificación de usuario, con ella podrás canjear tus puntos acumulados, solo debes descargarla y la presentás en el comercio adherido</p>
							<div ref={identificacion} className="rounded border sombra row justify-content-around align-items-center border-left-warning m-4 text-center" >
								<div className=" col-sm justify-content-around" >
									<img className="w-75" src={user[0].image} alt='Imagen de Perfil' />
									<div className='text-xs font-weight-bold text-center '>{user[0].name}   {user.lastname}</div>
								</div>
								<div className="col-sm align-middle" >
									<QRCodeCanvas value={user[0].password}
										id="qrUser"
										size={200}
									/>

								</div>
							</div>
							<div className=" m-2 ">
								<form onSubmit={downloadQRCode}>
									<button className="btn btn-warning" type="submit">Descargar Identificación</button>
								</form>
							</div>

						</div>
						<div>
							<h3>Puntos acumulados: <span className='text-success'>{(user[0].points === null) ? 0 : user[0].points}</span></h3>
						</div>
						<div className=" m-2 ">

							<button className="btn btn-warning" onClick={recommendationByUser}>Ver Recomendaciones Generadas</button>

						</div>
					</div>

					{recommendations.length !== 0 && (
						<>
							<div className="table-responsive">
								<table className="table table-sm shadow ">
									<thead>
										<tr>
											<th scope="col">#</th>
											<th scope="col">Fecha de Creación</th>
											<th scope="col">Empresa</th>
											<th scope="col">Estado</th>
										</tr>
									</thead>
									<tbody>
										{recommendations.map((recomendacion, i) => {
											let dateCorrection = recomendacion.dateCreate + 'T00:00:00';
											let fecha = new Date(dateCorrection).toLocaleDateString('es-AR')

											return (
												<tr key={recomendacion.id}>
													<th scope="row">{recomendacion.id}</th>
													<td>{fecha}</td>
													<td>{recomendacion.companies_name}</td>
													<td>{recomendacion.status}</td>
													{(recomendacion.status === 'pendiente' || recomendacion.status === 'confirmada') && <td><button className="btn btn-warning" onClick={recommendationPendientes}>...</button></td>}
												</tr>
											)
										})}

									</tbody>
								</table>
							</div>

							{recommendationsPending.length !== 0 && (

								<table className="table table-sm shadow ">
									<thead>
										<tr>
											<th scope="col">#</th>
											<th scope="col">Fecha de Presentación</th>
											<th scope="col">Empresa</th>
											<th scope="col">Estado</th>
										</tr>
									</thead>
									<tbody>
										{recommendationsPending.map((recomendacionPendiente, i) => {
											let dateCorrection = recomendacionPendiente.datePresent + 'T00:00:00';
											let fechaPresent = new Date(dateCorrection).toLocaleDateString('es-AR')

											return (
												<tr key={recomendacionPendiente.id}>
													<th scope="row">{recomendacionPendiente.id}</th>
													<td>{fechaPresent}</td>
													<td>{recomendacionPendiente.companies_name}</td>
													<td>{recomendacionPendiente.status_name}</td>
												</tr>
											)

										})}

									</tbody>
								</table>



							)}

							<strong>Estado:</strong>
							<p>"Creada" - La recomendación ha sido creada y aún no se presenta en la Empresa</p>
							<p>"Pendiente" - La recomendación ha sido presentada en la Empresa, pero aún no ha sido "Confirmada"</p>
							<p>"Confirmada" - La recomendación ha sido confirmada por la Empresa, la persona que recomendaste seguramente consumió algún producto o servicio de la Empresa y ella la confirmó, el punto se acreditó en tu cuenta !!!</p>
							<p><strong>Nota:</strong> Recuerda que las recomendaciones que tengan estado "Confirmada" serán las que te suman puntos.
								Cada recomendación la confirma la Empresa que la recepciona cuando el recomendado consume algún producto o servicio. </p>
						</>

					)}



				</>
			)}
		</>)
}

export default Profile;
