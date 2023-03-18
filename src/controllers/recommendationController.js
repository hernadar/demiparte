const { validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const db = require('../database/models');

const controller = {
    list: (req, res) => {
        db.Recommendation.findAll( {
            include: [{ association: 'companies' }, { association: 'users' }]
        },
        {order: [
            ['datePesent', 'DESC'],
        
        ]}
        )
            .then(function (recommendations) {
                res.render('recommendationsList', { recommendations })
            })
            .catch(function (e) {
                console.log(e)
            })
    },

    register: (req, res) => {
        let pedidoUser = db.User.findAll();

        let pedidoCompanies = db.Company.findAll();

        Promise.all([pedidoUser, pedidoCompanies])
            .then(function ([users, companies]) {
                
                return res.render('recommendationCreate', { users, companies })
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
                      // encrypto el codigo de Recomendacion 
                    let genCode = bcryptjs.hashSync(req.body.users_id+req.body.companies_id, 10);
                    let recommendationTocreate = {
                        users_id: req.body.users_id,
                        companies_id: req.body.companies_id,
                        code: genCode,
                        dateCreate: req.body.dateCreate

                    }

                    db.Recommendation.create(recommendationTocreate)
                        .then(function (response) {
                            return res.redirect('/users/recommendation')
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

    detail: (req, res) => {
        db.Recommendation.findByPk(req.params.id, {
            include: [{ association: 'users' }, { association: 'companies' }]

        })
            .then(function (recommendation) {

                return res.render('recommendationDetail', { recommendation })
            })
            .catch(function (e) {
                console.log(e)
            })
    },

    updatePresentar: (req, res) => {
        db.Recommendation.findByPk(req.params.id)
            .then(function (recommendation) {
                let date= new Date();
                let year= date.getFullYear();
                let month= date.getMonth()+1;
                let day= date.getDate();
                let dateToPresent = year + '-' + month+ '-' + day
                let recommendationUpadate= {
                    ...recommendation,
                    datePresent: dateToPresent,
                    status: 'pendiente'
                    }
                db.Recommendation.update(recommendationUpadate, {
                    where: {
                        id: req.params.id
                    }
                })
                .then(function(recommendation) {
                    res.redirect('/users/recommendation/')
                })
                .catch(function (e) {
                    console.log(e)
                })
            })
            .catch(function (e) {
                console.log(e)
            })
    },

    updateConfirmar: (req, res) => {
        db.Recommendation.findByPk(req.params.id)
            .then(function (recommendation) {
                var userId = recommendation.users_id
                let date= new Date();
                let year= date.getFullYear();
                let month= date.getMonth()+1;
                let day= date.getDate();
                let dateToConfirm = year + '-' + month+ '-' + day
                let recommendationUpadate= {
                    ...recommendation,
                    dateConfirm: dateToConfirm,
                    status:'confirmada'
                    }
                db.Recommendation.update(recommendationUpadate, {
                    where: {
                        id: req.params.id
                    }
                })
                .then(function(response) {

                    db.User.findByPk(userId)          
                    .then(function(user) {
                        
                        if (user.points===null) {
                            var pointsToUpdate= 1
                        } else {
                            pointsToUpdate= points +1
                        }
                        
                        console.log(pointsToUpdate)
                        let UserToUpdate = {
                            ...user,
                            points: pointsToUpdate
                        }
                        db.User.update(UserToUpdate, {
                            where: {
                                id: userId
                            }
                        })
                        .then(function(response) {
                            
                            res.redirect('/users/recommendation/')
                        })
                        .catch(function (e) {
                            console.log(e)
                        })
    
    
                    })
                    .catch(function (e) {
                        console.log(e)
                    })
                    
                })
                .catch(function (e) {
                    console.log(e)
                })

                
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
	},
    
}
module.exports = controller