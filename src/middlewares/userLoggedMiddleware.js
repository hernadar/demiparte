const db = require('../database/models');

function userLoggedMiddleware(req, res, next) {
if (!req.session.userLogged){
		
	res.locals.isLogged = false};
// 	if (req.cookies.userEmail) {
// 		let emailInCookie = req.cookies.userEmail;
// 	 	db.User.findOne({where: {email: emailInCookie}})
// 	 		.then(function(userFromCookie){
// 	 				req.session.userLogged = userFromCookie;
// 					next()
// 				})
// 	 		.catch(function(e){
// 	 			console.log(e)
// 				next();
// 	 		})
// 	} else {
// 		console.log('El usuario no está logueado y no hay cookie')
// 		next();
// 	}
	
// 	}
 next()
}

module.exports = userLoggedMiddleware;