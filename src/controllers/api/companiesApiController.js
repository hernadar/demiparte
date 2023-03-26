const { validationResult } = require('express-validator')
const db = require('../../database/models');
const path = require('path')
const fs= require('fs');


const controller = {

    list: async (req, res) => {
        let consulta = "SELECT * FROM `companies`"
        const [companies, metadata] = await db.sequelize.query(consulta)
        
        for ( i=0 ; i<companies.length ; i++ ) {
            let imagen = companies[i].image
          
            let imagenBase64 = fs.readFileSync(path.join(__dirname,'../../../public/images/logos/'+ imagen),{encoding: 'base64'})
            let extension = imagen.slice(-3)
           
            if (extension ==='png') {
                
                companies[i].image='data:image/png;base64,'+ imagenBase64
            }
            if (extension ==='jpg') {
                
                companies[i].image='data:image/jpg;base64,'+ imagenBase64
            }
        }
        
        let response = {
            meta: {
                status: 200,
                total: companies.length,
                url: 'api/companies'
            },
            data: companies
        }
        res.json(response);
    },
    listAreas: async (req, res) => {
        let consulta = "SELECT * FROM `areas`"
        const [areas, metadata] = await db.sequelize.query(consulta)
        let response = {
            meta: {
                status: 200,
                total: areas.length,
                url: 'api/companies/areas'
            },
            data: areas
        }
        res.json(response);
    },
    // listAreas:(req,res) => {
    //     console.log('estoy llegando')
    //     db.Area.findAll()
    //         .then(function (areas) {
    //             let response = {
    //                 meta: {
    //                     status : 200,
    //                     total: areas.length,
    //                     url: 'api/areas'
    //                 },
    //                 data: areas
    //             }
    //                 res.json(response);
    //             })
    //     .catch(function (e) {
    //         console.log(e)
    //     })
    // },  
    register: (req, res) => {
        db.Area.findAll()
            .then(function (areas) {
                return res.render('companyRegister', { areas })
            })
            .catch(function (e) {
                console.log(e)
            })
    },
    create: async (req, res) => {
        console.log(req.body)
        console.log(req.file)

        const resultValidation = validationResult(req);

        if (resultValidation.errors.length > 0) {
            //debería analizar cada uno de los errores cargando en una variable
            // errors:resultValidation.mapped(), esta última función me convierte
            // el array en un objeto literal, para luego trabajarlo más comodo
            return res.send(resultValidation)
        }

        let imageCompany

        if (req.file == undefined) {
            imageCompany = 'company.webp'
        } else {
            imageCompany = req.file.filename
        }


        parseInt(req.body.pricePoint)

        let consulta = `INSERT INTO companies (name, description, image, areas_id, pricePoint) VALUES ("` + req.body.name + `", "` + req.body.description + `", "` + imageCompany + `", "` + req.body.areas_id + `", "` + parseInt(req.body.pricePoint) + `")`
        const [recomendaciones, metadata] = await db.sequelize.query(consulta)

        return recomendaciones


    },
    // create: (req,res) => {
    //     const resultValidation = validationResult(req);
    //    console.log(resultValidation.errors)
    //     if(resultValidation.errors.length > 0) {
    //         //debería analizar cada uno de los errores cargando en una variable
    //         // errors:resultValidation.mapped(), esta última función me convierte
    //         // el array en un objeto literal, para luego trabajarlo más comodo
    //         return res.send('se registró algún error en los datos recibidos del formulario de Registro de usuario')
    //     }
    //    //No es necesario esta verificación porque ya se realizó en el Front

    // //    db.Company.findOne({ where: { name: req.body.name } })
    // //    .then(function (companyInDB) {
    // //        if (companyInDB) {
    // //            return res.send('la empresa ya existe');//le tengo que decir al front que el usuario ya existe
    // //        } else {
    //            let imageCompany

    //            if (req.file == undefined) {
    //                imageCompany = 'company.webp'
    //            } else {
    //                imageCompany = req.file.filename
    //            }

    //            let companyToCreate = {
    //             ...req.body,
    //             pricePoint:parseInt(req.body.pricePoint),
    //             image: imageCompany,
    //         }
    //         db.Company.create(companyToCreate)
    //             .then(function (response) {
    //                 return response
    //             })
    //             .catch(function (e) {
    //                 console.log(e)
    //             })




    profile: async (req, res) => {

        let consulta = "SELECT companies.id, companies.name, description, recomendations, image, pricePoint, areas.name as areas_name from companies JOIN areas WHERE companies.id='" + req.params.idCompany + "' AND companies.areas_id = areas.id";
        const [company, metadata] = await db.sequelize.query(consulta)
        
        for ( i=0 ; i<company.length ; i++ ) {
            let imagen = company[i].image
           
            let imagenBase64 = fs.readFileSync(path.join(__dirname,'../../../public/images/logos/'+ imagen),{encoding: 'base64'})
            let extension = imagen.slice(-3)
           
            if (extension ==='png') {
                
                company[i].image='data:image/png;base64,'+ imagenBase64
            }
            if (extension ==='jpg') {
                
                company[i].image='data:image/jpg;base64,'+ imagenBase64
            }
        }
        let response = {
            meta: {
                status: 200,
                total: company.length,
                url: 'api/companies/profile/:idCompany'
            },
            data: company
        }
        res.json(response);


    },
    edit: (req, res) => {
        let pedidoCompany = db.Company.findByPk(req.params.idCompany);

        let pedidoAreas = db.Area.findAll();

        Promise.all([pedidoCompany, pedidoAreas])
            .then(function ([company, areas]) {

                return res.render('companyEdit', { company, areas })
            })
            .catch(function (e) {
                console.log(e)
            })
    },
    update: (req, res) => {

        let imageProfile

        if (req.file == undefined) {
            imageProfile = 'company.webp'
        } else {
            imageProfile = req.file.filename
        }

        // encrypto la contraseña 
        let companyToEdit = {
            ...req.body,

            image: imageProfile,
        }
        db.Company.update(companyToEdit, {
            where: {
                id: req.params.idCompany
            }
        })
            .then(function () {
                return res.redirect('/companies')
            })
            .catch(function (e) {
                console.log(e)
            })
    },
    delete: (req, res) => {
        db.Company.destroy({
            where: {
                id: req.params.idCompany
            }
        })
            .then(function (response) {
                return res.redirect('/companies')
            })
            .catch(function (e) {
                console.log(e)
            })
    }
}

module.exports = controller