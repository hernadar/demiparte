const { validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const db = require('../database/models');

const controller = {
    list: (req, res) => {
        db.User.findAll()
            .then(function (users) {
                res.render('usersList', { users })
            })
            .catch(function (e) {
                console.log(e)
            })
    },

    register: (req, res) => {
        db.Privilege.findAll()
            .then(function (privileges) {
                return res.render('userRegister', { privileges })
            })
            .catch(function (e) {
                console.log(e)
            })

    },

    create: (req, res) => {
        
        const resultValidation = validationResult(req);

        if (resultValidation.errors.length > 0) {
            //debería analizar cada uno de los errores cargando en una variable
            // errors:resultValidation.mapped(), esta última función me convierte
            // el array en un objeto literal, para luego trabajarlo más comodo
            return res.send(resultValidation)
        }

        // Verifico si el usuario ya existe en la DB

        db.User.findOne({ where: { email: req.body.email } })
            .then(function (userInDB) {
                if (userInDB) {
                    return res.send('el usuario ya existe');//le tengo que decir al front que el usuario ya existe
                } else {
                    let imageProfile

                    if (req.file == undefined) {
                        imageProfile = 'user.png'
                    } else {
                        imageProfile = req.file.filename
                    }
                    // encrypto la contraseña 
                    let userToCreate = {
                        ...req.body,
                        password: bcryptjs.hashSync(req.body.password, 10),
                        image: imageProfile,
                    }
                    db.User.create(userToCreate)
                        .then(function (response) {
                            return res.redirect('/users/login')
                        })
                        .catch(function (e) {
                            console.log(e)
                        })
                }
            })
            .catch(function (e) {
                console.log(e)
            })


    },

    login: (req, res) => {
        return res.render('userLogin')
    },

    loginProcess: (req,res) => {
 
        db.User.findOne({ where: { email: req.body.email } })
            .then(function (userToLogin) { 
                if(userToLogin) {
                    let isOkThePassword = bcryptjs.compareSync(req.body.password, userToLogin.password);
                    if (isOkThePassword) {
                        delete userToLogin.password;
				        req.session.userLogged = userToLogin;
                        if(req.body.remember_user) {
                            res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60) *2})
                            console.log(req.cookies.userEmail)
                        }
                        return res.redirect('/')
                    } else {
                        console.log('Las credenciales son incorrectas')
                        return res.render('userlogin')
                    }
                } else {
                    // retornar un mensaje de que el usurio no existe
                    return res.render('userLogin')
                }
                })
            .catch(function (e) {
                console.log(e)
            })
    },  

    profile: (req, res) => {
        db.User.findByPk(req.params.id, {
            include: [{ association: 'privileges' }]
        })
            .then(function (user) {

                return res.render('userDetail', { user })
            })
            .catch(function (e) {
                console.log(e)
            })
    },

    edit: (req, res) => {
        let pedidoUser = db.User.findByPk(req.params.id);

        let pedidoPrivileges = db.Privilege.findAll();

        Promise.all([pedidoUser, pedidoPrivileges])
            .then(function ([user, privileges]) {

                return res.render('userEdit', { user, privileges })
            })
            .catch(function (e) {
                console.log(e)
            })
    },

    update: (req, res) => {

        let imageProfile

        if (req.file == undefined) {
            imageProfile = 'user.png'
        } else {
            imageProfile = req.file.filename
        }

        // encrypto la contraseña 
        let userToEdit = {
            ...req.body,
            password: bcryptjs.hashSync(req.body.password, 10),
            image: imageProfile,
        }
        db.User.update(userToEdit, {
            where: {
                id: req.params.id
            }
        })
            .then(function () {
                return res.redirect('/users')
            })
            .catch(function (e) {
                console.log(e)
            })
    },

    delete: (req, res) => {
        db.User.destroy({
            where: {
                id: req.params.id
            }
        })
            .then(function (response) {
                return res.redirect('/users')
            })
            .catch(function (e) {
                console.log(e)
            })

    },
    logout: (req, res) => {
		res.clearCookie('userEmail');
		req.session.destroy();
		return res.redirect('/');
	}
}
module.exports = controller