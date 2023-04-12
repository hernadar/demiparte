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
    
    updateConfirmar: async (req, res) => {
        console.log('Estoy confirmando')
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let dateToConfirm = year + '-' + month + '-' + day
        //Cambia el estado de la recomendacion a Confirmada en la tabla de estado
        let consulta = `UPDATE status SET status = 'confirmada', date='` + dateToConfirm + `' WHERE id='` + req.params.id + `'`;
        const [status, metadata] = await db.sequelize.query(consulta)
      
        //Cambia el estado de la recomendación a Confirmada en la tabla de Recomendaciones
        let recomendacion = `UPDATE recommendations SET status = 'confirmada', dateConfirm='` + dateToConfirm + `' WHERE id='` + req.params.recomenId + `'`;
        const [recommendation, metadata2] = await db.sequelize.query(recomendacion)
        
        //busca el usuario que generó la recomandación
        let consultausuario = `SELECT * FROM users WHERE id='` + req.params.userId + `'`;
        const [user, metadata3] = await db.sequelize.query(consultausuario)
        //Verifica sus puntos
        console.log(user)
        if (user[0].points === null ) {
            user[0].point = 0
        }
        //Actualiza sus puntos 
        const pointsToUpdate =(parseInt(user[0].points)) + 1
        console.log(pointsToUpdate)
        let updateausuario = `UPDATE users SET points = '` + pointsToUpdate + `' WHERE id='` + req.params.userId + `'`;
        const [userUpdated, metadata4] = await db.sequelize.query(updateausuario)

        let response = {
            meta: {
                status: 200,
                total: 1,
                url: 'api/users/:userId/recommendation/:recomId/confirm/:id'
            },
            data: userUpdated
        }
        res.json(response);

      
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
     
        let consulta = "SELECT recommendations.id, dateCreate, datePresent, dateConfirm, status.id as status_id, status.status as status_name, companies.name as companies_name FROM recommendations INNER JOIN companies ON companies_id=companies.id JOIN status ON recommendations.id=status.recommendations_id WHERE users_id='" + req.params.id + "' AND status.status='pendiente'";
        const [recomendaciones, metadata] = await db.sequelize.query(consulta)
        console.log(recomendaciones)
        
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
   
    findByUserPresent: async (req, res) => {
     
        let consulta = "SELECT recommendations.id, dateCreate, datePresent, dateConfirm, status.id as status_id, status.status as status_name, companies.name as companies_name FROM recommendations INNER JOIN companies ON companies_id=companies.id JOIN status ON recommendations.id=status.recommendations_id WHERE users_id='" + req.params.id + "'";
        const [recomendaciones, metadata] = await db.sequelize.query(consulta)
        console.log(recomendaciones)
        
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
    findByUserConfirm: async (req, res) => {
     
        let consulta = `SELECT COUNT(*) as cantidadPuntos FROM recommendations INNER JOIN status ON status.status ='confirmada' AND status.recommendations_id = recommendations.id WHERE companies_id='`+ req.params.idCompany + `' AND users_id = '`+req.params.id + `'`;
        const [cuentaPuntos, metadata] = await db.sequelize.query(consulta)
       
        
        let response = {
            meta: {
                status: 200,
                total: cuentaPuntos.length,
                url: 'api/users/:id/recommendation/idCompany/confirm'
            },
            data: cuentaPuntos
        }
        res.json(response);
    },
    billing: async (req, res) => {
        let consulta = `SELECT * FROM recommendations INNER JOIN status ON (status.status ='confirmada' OR status.status = 'canjeada') AND status.recommendations_id = recommendations.id WHERE companies_id='`+ req.params.idCompany + `'`;
        const [recomendacionesConfirmadas, metadata] = await db.sequelize.query(consulta)
        let response = {
            meta: {
                status: 200,
                total: recomendacionesConfirmadas.length,
                url: 'api/company/:id/billing'
            },
            data: recomendacionesConfirmadas
        }
        res.json(response);
    },
    findbilling: async (req, res) => {
        let consulta = `SELECT recommendations.id as id_recommendation, recommendations.companies_id, status.id, status.status, status.date FROM recommendations INNER JOIN status ON (status.status ='confirmada' OR status.status = 'canjeada') AND status.recommendations_id = recommendations.id`;
        const [recomendacionesConfirmadas, metadata] = await db.sequelize.query(consulta)
        let response = {
            meta: {
                status: 200,
                total: recomendacionesConfirmadas.length,
                url: 'api/company/recomendations/billing'
            },
            data: recomendacionesConfirmadas
        }
        res.json(response);
    },
    createBilling: async (req, res) => {
        
        let consulta = `SELECT * FROM companies WHERE id = '` + req.params.idCompany + `'`;
        const [company, metadata] = await db.sequelize.query(consulta)
        //Armo el contenido de los campos de la factura con la info que dispongo
        //Dia de facturación
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let dateCreate = year + '-' + month + '-' + day
        //Calculo en total de la factura con el precio del punto y la cantidad de recomendaciones confirmadas o canjeadas
        let total = req.body.length*company[0].pricePoint*company[0].fee
        // Inserto el registro en la tabla de facturas (invoices)
        let consultaFactura = `INSERT INTO invoices (dateCreate, status, companies_id, total) VALUES ('` + dateCreate + `', 'pendiente', '` + req.params.idCompany + `', '`+ total + `')`
        const [factura, metadata1] = await db.sequelize.query(consultaFactura)
        //Inserto los registros en la tabla de detalle de factura (invoicedetail) pero antes debo obtener el id de la factura 
        // que acabo de crear 
        let consultaUltimaFactura = 'SELECT MAX(id) ultimo FROM invoices; '
        const [ultimaFactura, metadata2] = await db.sequelize.query(consultaUltimaFactura)
        for ( i = 0 ; i < req.body.length ; i++ ){
            let consultaDetalle = `INSERT INTO invoiceDetail (date, invoices_id, status_id, sutotal) VALUES ('` + req.body[i].date + `', '` + ultimaFactura[0].ultimo + `', '` + req.body[i].id + `', '` + company[0].pricePoint*company[0].fee +`')`
            const [detalleFactura, metadata3] = await db.sequelize.query(consultaDetalle)
        }
    
            let response = {
            meta: {
                status: 200,
                total: factura.length,
                url: 'api/company/:idCompany/billing/'
            },
            data: factura
        }
        res.json(response);
    },
}
module.exports = controller