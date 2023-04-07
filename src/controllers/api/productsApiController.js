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
    edit: async (req, res) => {
       
        let consulta = "SELECT * from products WHERE id = '" + req.params.idProduct + "'";
        const [product, metadata] = await db.sequelize.query(consulta)
        
        for ( i=0 ; i<product.length ; i++ ) {
            let imagen = product[i].image
           
            let imagenBase64 = fs.readFileSync(path.join(__dirname,'../../../public/images/products/'+ imagen),{encoding: 'base64'})
            let extension = imagen.slice(-3)
           
            if (extension ==='png') {
                
                product[i].image='data:image/png;base64,'+ imagenBase64
            }
            if (extension ==='jpg') {
                
                product[i].image='data:image/jpg;base64,'+ imagenBase64
            }
        }
        let response = {
            meta: {
                status: 200,
                total: product.length,
                url: 'api/companies/:idCompany/products/edit/:idCompany'
            },
            data: product
        }
        res.json(response);


    },
    update: async (req, res) => {
        if(req.body.name ==='Dinero'){
            let consulta1 = `UPDATE recomendame.companies SET pricePoint = '` + Number(req.body.price)  + `' WHERE (id = '` + req.params.idCompany + `')`
 
            const [company, metadata1] = await db.sequelize.query(consulta1)
           
      
        }

        let imageProduct

        if (req.file == undefined) {
            imageProduct = 'money.png'
        } else {
            imageProduct = req.file.filename
        }

        let consulta = `UPDATE recomendame.products SET name = '` + req.body.name + `', description = '` + req.body.description + `', image = '` + imageProduct + `', category = '`  + req.body.category + `', price = '`  + Number(req.body.price) +  `', points = '`  + parseInt(req.body.points) + `' WHERE (id = '` + req.params.idProduct + `')`
 
        const [product, metadata] = await db.sequelize.query(consulta)
        let response = {
            meta: {
                status: 200,
                total: product.length,
                url: 'api/companies/:idCompany/products/edit/:idProduct'
            },
            data: product
        }
        res.json(response);


    }, 
    delete: async (req, res) => {
        //Busco en la DB si existe canjes asociados al producto a borrar
        let consulta1= `SELECT * FROM changeDetail WHERE products_id ='`+  req.params.idProduct + `'`
        const [canjes, metadata1] = await db.sequelize.query(consulta1)
       console.log(canjes.length)
        //si existen canjes, borro primero el detalle del canje que tenga ese producto
        if (canjes.length !== 0){
        let consulta2= `DELETE FROM changeDetail WHERE products_id ='`+  req.params.idProduct + `'`
        const [canjes, metadata2] = await db.sequelize.query(consulta2)
       }
       //Busco en la DB el producto a borra por id, para obtener el nombre del archivo de imagen que tiene 
       let consulta3= `SELECT * FROM products WHERE id ='`+  req.params.idProduct + `'`
        const [producto, metadata2] = await db.sequelize.query(consulta3)
       //Borro archivo de imagen del disco
        let imagenABorrar = fs.unlinkSync(path.join(__dirname,'../../../public/images/products/'+ producto[0].image))
       //Borro registro de producto en su tabla
        let consulta = `DELETE FROM recomendame.products WHERE (id = '` + req.params.idProduct + `')`
       
        const [product, metadata] = await db.sequelize.query(consulta)
        let response = {
            meta: {
                status: 200,
                total: product.length,
                url: 'api/companies/:idCompany/products/edit/:idProduct'
            },
            data: product
        }
        res.json(response);
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