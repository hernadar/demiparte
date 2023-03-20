const { validationResult }=require ('express-validator')
const db= require('../database/models');

const controller = {
    list: (req,res) => {
        db.Company.findAll()
        .then(function (companies) {
            res.render('companiesList', { companies })
        })
        .catch(function (e) {
            console.log(e)
        })
    },
    listAreas:(req,res) => {
        db.Area.findAll()
        .then(function (companies) {
            res.render('companiesList', { companies })
        })
        .catch(function (e) {
            console.log(e)
        })
    }, 
    register: (req,res) => {
        db.Area.findAll()
            .then(function (areas) {
                return res.render('companyRegister', { areas })
            })
            .catch(function (e) {
                console.log(e)
            })
    }, 
    processRegister: (req,res) => {
        const resultValidation = validationResult(req);
       console.log(resultValidation.errors)
        if(resultValidation.errors.length > 0) {
            //debería analizar cada uno de los errores cargando en una variable
            // errors:resultValidation.mapped(), esta última función me convierte
            // el array en un objeto literal, para luego trabajarlo más comodo
            return res.send('se registró algún error en los datos recibidos del formulario de Registro de usuario')
        }
       // Verifico si el usuario ya existe en la DB

       db.Company.findOne({ where: { name: req.body.name } })
       .then(function (companyInDB) {
           if (companyInDB) {
               return res.send('la empresa ya existe');//le tengo que decir al front que el usuario ya existe
           } else {
               let imageProfile

               if (req.file == undefined) {
                   imageProfile = 'company.webp'
               } else {
                   imageProfile = req.file.filename
               }
               parseInt(req.body.pricePoint)
               let companyToCreate = {
                ...req.body,
                image: imageProfile,
            }
            db.Company.create(companyToCreate)
                .then(function (response) {
                    return res.redirect('/companies')
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
    
    profile: (req, res) => {
        db.Company.findByPk(req.params.idCompany, {
            include: [{ association: 'areas' }]
        })
            .then(function (company) {

                return res.render('companyDetail', { company })
            })
            .catch(function (e) {
                console.log(e)
            })
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