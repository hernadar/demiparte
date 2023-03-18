const { validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const db = require('../../database/models');

const controller = {
    list: (req, res) => {
        
        db.User.findAll()
            .then(function (users) {
                let response = {
                    meta: {
                        status : 200,
                        total: users.length,
                        url: 'api/users'
                    },
                    data: users
                }
                    res.json(response);
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
        console.log('pasó por acá')
        const resultValidation = validationResult(req);

        if (resultValidation.errors.length > 0) {
            //debería analizar cada uno de los errores cargando en una variable
            // errors:resultValidation.mapped(), esta última función me convierte
            // el array en un objeto literal, para luego trabajarlo más comodo
            return res.send(resultValidation)
        }

            let imageProfile

            if (req.file == undefined) {
                imageProfile = 'user.png'
                } else {
                imageProfile = req.file.filename
                }
            // encrypto la contraseña 
                console.log(req.body)
                   
            let userToCreate = {
                ...req.body,
                image: imageProfile,
                }
            db.User.create(userToCreate)
                .then(function (response) {
                        return response
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
                        let response = {
                            meta: {
                                status : 200,
                                total: 1,
                                url: 'api/users/login'
                            },
                            data: 'userLogged'
                        }
                            res.json(response);
                        
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
                    
                        
             
             let response = {
                 meta: {
                     status : 200,
                     total: user.length,
                     url: 'api/user/profile/:iduser'
                 },
                 data: user
             }
            res.json(response);
           
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