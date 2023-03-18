const { validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const db = require('../../database/models');

const controller = {
    list: (req, res) => {

        db.Recommendation.findAll()
            .then(function (recommendations) {

                let response = {
                    meta: {
                        status: 200,
                        total: recommendations.length,
                        url: 'api/users/recommendation'
                    },
                    data: recommendations
                }
                res.json(response);
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

        let recommendationTocreate = {
            users_id: req.body.users_id,
            companies_id: req.body.companies_id,
            code: req.body.code,
            dateCreate: req.body.dateCreate,
            status: req.body.status

        }

        db.Recommendation.create(recommendationTocreate)
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

    loginProcess: (req, res) => {
        db.User.findOne({ where: { email: req.body.email } })
            .then(function (userToLogin) {
                if (userToLogin) {
                    let isOkThePassword = bcryptjs.compareSync(req.body.password, userToLogin.password);
                    if (isOkThePassword) {
                        delete userToLogin.password;
                        req.session.userLogged = userToLogin;
                        if (req.body.remember_user) {
                            res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60) * 2 })
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

                let recommendationUpadate = {
                    ...recommendation,
                    status: 'pendiente'
                }
                db.Recommendation.update(recommendationUpadate, {
                    where: {
                        id: req.params.id
                    }
                })
                    .then(function (recommendation) {
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

                let recommendationUpadate = {
                    ...recommendation,
                    status: 'confirmada'
                }
                db.Recommendation.update(recommendationUpadate, {
                    where: {
                        id: req.params.id
                    }
                })
                    .then(function (recommendation) {
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
    findByCode: (req, res) => {
        db.Recommendation.findOne({ where: { code: req.params.code } })
            .then(function (recommendacion) {
                let response = {
                    meta: {
                        status: 200,
                        total: recommendacion.length,
                        url: 'api/users/recommendation/find/:code'
                    },
                    data: recommendacion
                }
                res.json(response);
            })
            .catch(function (e) {
                console.log(e)
            })
    },
    findByUser: (req, res) => {
        db.Recommendation.findAll({ where: { users_id: req.params.id },
            include: [{ association: 'companies' }] })
            .then(function (recomendaciones) {
                let response = {
                    meta: {
                        status: 200,
                        total: recomendaciones.length,
                        url: 'api/users/:id/recommendation'
                    },
                    data: recomendaciones
                }
                res.json(response);
            })
            .catch(function (e) {
                console.log(e)
            })
    },
    findByCompany: (req, res) => {
        db.Recommendation.findAll({ where: { companies_id: req.params.idCompany },
            include: [{ association: 'companies' }] })
            .then(function (recomendaciones) {
                let response = {
                    meta: {
                        status: 200,
                        total: recomendaciones.length,
                        url: 'api/users/:id/recommendation'
                    },
                    data: recomendaciones
                }
                res.json(response);
            })
            .catch(function (e) {
                console.log(e)
            })
    }
}
module.exports = controller