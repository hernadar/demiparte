const { compareSync } = require('bcryptjs');
const { validationResult }=require ('express-validator')
const db= require('../../database/models');


const path = require('path')
const fs= require('fs');


const controller = {
    list: async (req, res) => {
        let consulta = "SELECT * FROM `products` WHERE companies_id='" + req.params.idCompany + "'";
        const [products, metadata] = await db.sequelize.query(consulta)
        for ( i=0 ; i<products.length ; i++ ) {
            let imagen = products[i].image
            
            let imagenBase64 = fs.readFileSync(path.join(__dirname,'../../../public/images/products/'+ imagen),{encoding: 'base64'})
            let extension = imagen.slice(-3)
           
            if (extension ==='png') {
               
                products[i].image='data:image/png;base64,'+ imagenBase64
            }
            if (extension ==='jpg') {
               
                products[i].image='data:image/jpg;base64,'+ imagenBase64
            }
        }
       
            let response = {
                    meta: {
                        status : 200,
                        total: products.length,
                        url: '/api/companies/:id/products/'
                    },
                    data: products
                    }
                    res.json(response);               
            },
    // list: (req,res) => {
    //     db.Product.findAll({where:{companies_id:req.params.idCompany}})
    //         .then(function (products) {
    //             let response = {
    //                 meta: {
    //                     status : 200,
    //                     total: products.length,
    //                     url: 'api/products'
    //                 },
    //                 data: products
    //             }
    //                 res.json(response);
    //             })
    //     .catch(function (e) {
    //         console.log(e)
    //     })

       

    // }, 
    register: (req,res) => {
        // console.log(req.params.idCompany)
        db.Company.findOne({
            where: {
              id: req.params.idCompany
            }
          })
            .then(function (company) {
                
                return res.render('productRegister', {company})
                
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
            console.log(resultValidation)
        }

        let imageProduct

        if (req.file == undefined) {
            imageProduct = 'product.png'
        } else {
            imageProduct = req.file.filename
        }

        let consulta = `INSERT INTO products (name, description, category, price, points, image, companies_id) VALUES ("` + req.body.name + `", "` + req.body.description + `", "` + req.body.category + `", "` + Number (req.body.price) + `", "` + parseInt(req.body.points) + `", "` + imageProduct + `", "` + req.params.idCompany + `")`
        
        const [productos, metadata] = await db.sequelize.query(consulta)

        return productos


    }, 
    // create: (req,res) => {
    //     const resultValidation = validationResult(req);
    //     console.log(resultValidation)
    //     if(resultValidation.errors.length > 0) {
    //         //debería analizar cada uno de los errores cargando en una variable
    //         // errors:resultValidation.mapped(), esta última función me convierte
    //         // el array en un objeto literal, para luego trabajarlo más comodo
    //         return res.send('se registró algún error en los datos recibidos del formulario de Registro de usuario')
    //     }
    //    // Verifico si el usuario ya existe en la DB

    //    db.Product.findOne({ where: { name: req.body.name } })
    //    .then(function (productInDB) {
    //        if (productInDB) {
    //            return res.send('el producto ya existe');//le tengo que decir al front que el usuario ya existe
    //        } else {
    //            let imageProfile

    //            if (req.file == undefined) {
    //                imageProfile = 'product.jpg'
    //            } else {
    //                imageProfile = req.file.filename
    //            }
               
    //            let productToCreate = {
    //             ...req.body,
    //             image: imageProfile,
    //             companies_id:req.params.idCompany
    //         }
    //         db.Product.create(productToCreate)
    //             .then(function (response) {
    //                 return res.redirect('/companies/'+req.params.idCompany+'/products')
    //             })
    //             .catch(function (e) {
    //                 console.log(e)
    //             })
    //         }
    //     })
    //     .catch(function (e) {
    //         console.log(e)
    //     })

    // }, 
    
    detail: (req, res) => {
        db.Product.findByPk(req.params.idProduct, {
            include: [{ association: 'companies' }]
        })
            .then(function (product) {

                return res.render('productDetail', { product })
            })
            .catch(function (e) {
                console.log(e)
            })
    },
    edit: (req, res) => {
        let pedidoProduct = db.Product.findByPk(req.params.idProduct);

        let pedidoCompany =  db.Company.findOne({ where: { id: req.params.idCompany } });

        Promise.all([pedidoCompany, pedidoProduct])
            .then(function ([company, product]) {

                return res.render('productEdit', { company, product })
            })
            .catch(function (e) {
                console.log(e)
            })
    },
    update: (req, res) => {

        let imageProfile

        if (req.file == undefined) {
            imageProfile = 'product.jpg'
        } else {
            imageProfile = req.file.filename
        }

       
        let productToEdit = {
            ...req.body,
           
            image: imageProfile,
        }
        db.Product.update(productToEdit, {
            where: {
                id: req.params.idProduct
            }
        })
            .then(function () {
                return res.redirect('/companies/' + req.params.idCompany + '/products')
            })
            .catch(function (e) {
                console.log(e)
            })
    },
    delete: (req, res) => {
        
        db.Product.destroy({
            where: {
                id: req.params.idProduct
            }
        })
            .then(function (response) {
                return res.redirect('/companies/' + req.params.idCompany + '/products')
            })
            .catch(function (e) {
                console.log(e)
            })
        },

    image: async (req, res) => {
                   
                   data= fs.readFileSync(path.join(__dirname,'../../../public/images/avatars/user.png'),{encoding: 'base64'})
                   
                    let response = {
                        meta: {
                            status : 200,
                            
                            url: '/api/companies/:id/products/image'
                        },
                        data: data
                        }
                        res.json(response);               
                },
    findUserPoints: async (req, res) => {
       
        let consulta = "SELECT * FROM products WHERE companies_id='"+ req.params.idCompany + "' AND points<='"+ req.params.points + "'";
        const [products, metadata] = await db.sequelize.query(consulta)
        for ( i=0 ; i<products.length ; i++ ) {
            let imagen = products[i].image
            
            let imagenBase64 = fs.readFileSync(path.join(__dirname,'../../../public/images/products/'+ imagen),{encoding: 'base64'})
            let extension = imagen.slice(-3)
           
            if (extension ==='png') {
               
                products[i].image='data:image/png;base64,'+ imagenBase64
            }
            if (extension ==='jpg') {
               
                products[i].image='data:image/jpg;base64,'+ imagenBase64
            }
        }
       
            let response = {
                    meta: {
                        status : 200,
                        total: products.length,
                        url: '/api/companies/:id/products/change/:points'
                    },
                    data: products
                    }
                    res.json(response);               
            }, 
}

module.exports = controller