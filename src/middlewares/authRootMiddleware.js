function authRootMiddleware(req, res, next) {
	if (!req.session.userLogged) {
		res.locals.isLogged = false;
	} else {
		
		res.locals.isLogged = true;
		res.locals.userLogged = req.session.userLogged;

	}
	next();
}

module.exports = authRootMiddleware;