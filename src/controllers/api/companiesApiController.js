const { validationResult } = require('express-validator')
const db = require('../../database/models');
const path = require('path')
const fs= require('fs');


const controller = {

    list: async (req, res) => {
        let consulta = "SELECT * FROM `companies`"
        const [companies, metadata] = await db.sequelize.query(consulta)
       if (companies.length > 0 ) {
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
        

        const resultValidation = validationResult(req);

        if (resultValidation.errors.length > 0) {
            //debería analizar cada uno de los errores cargando en una variable
            // errors:resultValidation.mapped(), esta última función me convierte
            // el array en un objeto literal, para luego trabajarlo más comodo
            return res.send(resultValidation)
        }

        let imageCompany

        if (req.file == undefined) {
            imageCompany = 'company.png'
        } else {
            imageCompany = req.file.filename
        }


       

        let consulta = `INSERT INTO companies (name, description, image, areas_id, pricePoint, address, whatsapp) VALUES ("` + req.body.name + `", "` + req.body.description + `", "` + imageCompany + `", "` + req.body.areas_id + `", "` + Number(req.body.pricePoint) + `", "` + req.body.address + `", "` + req.body.whatsapp + `")`
        const [companies, metadata] = await db.sequelize.query(consulta)

        let consulta2 = `SELECT MAX(id) ultimo FROM companies;`
        const [idCompany, metadata2] = await db.sequelize.query(consulta2)

    
        let consulta3 = `INSERT INTO companies_has_users VALUES ('` + idCompany[0].ultimo + `', '`+ req.params.userId + `')`
        const [companyUser, metadata3] = await db.sequelize.query(consulta3)

        let consulta4 = `INSERT INTO products  (name, description, category, price, points, image, companies_id) VALUES ('Dinero', 'Valor de canje por punto', 'Efectivo', '` + parseInt(req.body.pricePoint) + `', '1', 'money.png', '` + idCompany[0].ultimo + `')`
        const [producto, metadata4] = await db.sequelize.query(consulta4)
        return producto


    },
  


    profile: async (req, res) => {

        let consulta = "SELECT companies.id, companies.name, description, recomendations, image, pricePoint, areas.name as areas_name, address, whatsapp from companies JOIN areas WHERE companies.id='" + req.params.idCompany + "' AND companies.areas_id = areas.id";
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
    edit: async (req, res) => {
       
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
                url: 'api/companies/profile/edit/:idCompany'
            },
            data: company
        }
        res.json(response);


    },
    update: async (req, res) => {
        let imageCompany

        if (req.file == undefined) {
            imageCompany = 'company.png'
        } else {
            imageCompany = req.file.filename
        }

        let consulta = `UPDATE recomendame.companies SET name = '` + req.body.name + `', description = '` + req.body.description + `', image = '` + imageCompany + `', areas_id = '`  + req.body.areas_id + `', pricePoint = '`  + parseInt(req.body.pricePoint) + `' WHERE (id = '` + req.params.idCompany + `')`
 
        const [company, metadata] = await db.sequelize.query(consulta)
        let response = {
            meta: {
                status: 200,
                total: company.length,
                url: 'api/companies/profile/edit/:idCompany'
            },
            data: company
        }
        res.json(response);


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