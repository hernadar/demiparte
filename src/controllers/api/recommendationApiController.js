const { validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const db = require('../../database/models');

const controller = {
    list: async (req, res) => {
        let consulta = "SELECT * FROM `recommendations`"
        const [recommendations, metadata] = await db.sequelize.query(consulta)
        let response = {
            meta: {
                status: 200,
                total: recommendations.length,
                url: 'api/users/recommendation'
            },
            data: recommendations
        }
        res.json(response);
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
    create: async (req, res) => {


        const resultValidation = validationResult(req);

        if (resultValidation.errors.length > 0) {
            //debería analizar cada uno de los errores cargando en una variable
            // errors:resultValidation.mapped(), esta última función me convierte
            // el array en un objeto literal, para luego trabajarlo más comodo
            return res.send(resultValidation)
        }


        let users_id = req.body.users_id;
        let companies_id = req.body.companies_id;
        let code = req.body.code;
        let dateCreate = req.body.dateCreate;
        let status = req.body.status;


        let consulta = `INSERT INTO recommendations (users_id, companies_id, code, dateCreate, status) VALUES ("` + users_id + `", "` + companies_id + `", "` + code + `", "` + dateCreate + `", "` + status + `")`
        const [recomendaciones, metadata] = await db.sequelize.query(consulta)

        return recomendaciones


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

    updatePresentar: async (req, res) => {
        console.log('Estoy actualizando')
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let dateToPresent = year + '-' + month + '-' + day
        let consulta = `UPDATE recommendations SET status = 'pendiente', datePresent='` + dateToPresent + `' WHERE id='` + req.params.id + `'`;
        const [recomendaciones, metadata] = await db.sequelize.query(consulta)

        let nuevaconsulta = `INSERT INTO status (status, date, recommendations_id) VALUES ("pendiente", "` + dateToPresent + `", "` + req.params.id + `")`;
        const [status, metadata2] = await db.sequelize.query(nuevaconsulta)
        let response = {
            meta: {
                status: 200,
                total: 1,
                url: 'api/users/recommendation/updatePresentar/:id'
            },
            data: status
        }
        res.json(response);

    },
    //     db.Recommendation.findByPk(req.params.id)
    //         .then(function (recommendation) {

    //             let recommendationUpadate = {
    //                 ...recommendation,
    //                 status: 'pendiente'
    //             }
    //             db.Recommendation.update(recommendationUpadate, {
    //                 where: {
    //                     id: req.params.id
    //                 }
    //             })
    //                 .then(function (recommendation) {
    //                     res.redirect('/users/recommendation/')
    //                 })
    //                 .catch(function (e) {
    //                     console.log(e)
    //                 })
    //         })
    //         .catch(function (e) {
    //             console.log(e)
    //         })
    // },

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
    // findByCode: (req, res) => {
    //     db.Recommendation.findOne({ where: { code: req.params.code } })
    //         .then(function (recommendacion) {
    //             let response = {
    //                 meta: {
    //                     status: 200,
    //                     total: recommendacion.length,
    //                     url: 'api/users/recommendation/find/:code'
    //                 },
    //                 data: recommendacion
    //             }
    //             res.json(response);
    //         })
    //         .catch(function (e) {
    //             console.log(e)
    //         })
    // },
    findByUser: async (req, res) => {

        let consulta = "SELECT recommendations.id, dateCreate, datePresent, dateConfirm, status, companies.name as companies_name FROM recommendations INNER JOIN companies ON companies_id=companies.id WHERE users_id='" + req.params.id + "'";
        const [recomendaciones, metadata] = await db.sequelize.query(consulta)
        let response = {
            meta: {
                status: 200,
                total: recomendaciones.length,
                url: 'api/users/:id/recommendation'
            },
            data: recomendaciones
        }
        res.json(response);
    },
    findByUserPending: async (req, res) => {
     
        let consulta = "SELECT recommendations.id, dateCreate, datePresent, dateConfirm, status.status as status_name, companies.name as companies_name FROM recommendations INNER JOIN companies ON companies_id=companies.id JOIN status ON recommendations.id=status.recommendations_id WHERE users_id='" + req.params.id + "'";
        const [recomendaciones, metadata] = await db.sequelize.query(consulta)
        let response = {
            meta: {
                status: 200,
                total: recomendaciones.length,
                url: 'api/users/:id/recommendation/pending'
            },
            data: recomendaciones
        }
        res.json(response);
    },
    // findByUser: (req, res) => {
    //     db.Recommendation.findAll({ where: { users_id: req.params.id },
    //         include: [{ association: 'companies' }] })
    //         .then(function (recomendaciones) {
    //             let response = {
    //                 meta: {
    //                     status: 200,
    //                     total: recomendaciones.length,
    //                     url: 'api/users/:id/recommendation'
    //                 },
    //                 data: recomendaciones
    //             }
    //             res.json(response);
    //         })
    //         .catch(function (e) {
    //             console.log(e)
    //         })
    // },
    findByCompany: async (req, res) => {
        let consulta = "SELECT * FROM recommendations JOIN companies WHERE companies_id= '" + req.params.idCompany + "' AND companies_id=companies.id";
        const [recomendaciones, metadata] = await db.sequelize.query(consulta)
        let response = {
            meta: {
                status: 200,
                total: recomendaciones.length,
                url: 'api/company/:id/recommendation'
            },
            data: recomendaciones
        }
        res.json(response);
    },


}
module.exports = controller