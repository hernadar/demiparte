function authMiddleware(req, res, next) {
	if (!req.session.userLogged) {
		return res.redirect('/users/login');
	} else {
		
		res.locals.isLogged = true;
		res.locals.userLogged = req.session.userLogged;

	}
	next();
}

module.exports = authMiddleware;