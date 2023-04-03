const { validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const db = require('../../database/models');

const path = require('path')
const fs= require('fs');

const controller = {
    list: async (req, res) => {
        let consulta= "SELECT * FROM `users`"
        const [users, metadata] = await db.sequelize.query(consulta)
                 let response = {
                    meta: {
                        status : 200,
                        total: users.length,
                        url: 'api/users'
                    },
                    data: users
                    }
                    res.json(response);               
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
    create: async (req, res) => {
     
    
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

               

        
        let consulta = `INSERT INTO users (name, lastname, phone, email, password, image, points, privileges_id) VALUES ("` + req.body.name + `", "` + req.body.lastname + `", "` + req.body.phone + `", "` + req.body.email + `", "` + req.body.password + `", "` + imageProfile + `", "` + 0 + `", "`+ req.body.privileges_id + `")`
        const [recomendaciones, metadata] = await db.sequelize.query(consulta)
          
        return recomendaciones
 
       
    },
    recoverPass: async (req, res) => {
        
        const resultValidation = validationResult(req);

        if (resultValidation.errors.length > 0) {
            //debería analizar cada uno de los errores cargando en una variable
            // errors:resultValidation.mapped(), esta última función me convierte
            // el array en un objeto literal, para luego trabajarlo más comodo
            return res.send(resultValidation)
        }
       
       
        
        let consulta = `UPDATE 'recomendame'.'users' SET 'password' = '` + req.body.password + `'WHERE ('email' = '` + req.body.email + `')`
        const [user, metadata] = await db.sequelize.query(consulta)
          
        return user
 
       
    },
    // create: (req, res) => {
    //     console.log('pasó por acá')
    //     const resultValidation = validationResult(req);

    //     if (resultValidation.errors.length > 0) {
    //         //debería analizar cada uno de los errores cargando en una variable
    //         // errors:resultValidation.mapped(), esta última función me convierte
    //         // el array en un objeto literal, para luego trabajarlo más comodo
    //         return res.send(resultValidation)
    //     }

    //         let imageProfile

    //         if (req.file == undefined) {
    //             imageProfile = 'user.png'
    //             } else {
    //             imageProfile = req.file.filename
    //             }
    //         // encrypto la contraseña 
    //             console.log(req.body)
                   
    //         let userToCreate = {
    //             ...req.body,
    //             image: imageProfile,
    //             }
    //         db.User.create(userToCreate)
    //             .then(function (response) {
    //                     return response
    //                 })
    //             .catch(function (e) {
    //                     console.log(e)
    //                 })
                
            

    // },

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
    profile: async (req, res) => {
        let consulta= "SELECT * FROM users WHERE id='" + req.params.id + "'"
        const [user, metadata] = await db.sequelize.query(consulta)
        
        for ( i=0 ; i<user.length ; i++ ) {
            let imagen = user[i].image
           
            let imagenBase64 = fs.readFileSync(path.join(__dirname,'../../../public/images/avatars/'+ imagen),{encoding: 'base64'})
            let extension = imagen.slice(-3)
           
            if (extension ==='png') {
                
                user[i].image='data:image/png;base64,'+ imagenBase64
            }
            if (extension ==='jpg') {
                
                user[i].image='data:image/jpg;base64,'+ imagenBase64
            }
        }
        
        let response = {
                    meta: {
                        status : 200,
                        total: user.length,
                        url: 'api/user/profile/:iduser'
                    },
                    data: user
                    }
                    res.json(response);               
            },
profileWithCompany: async (req, res) => {
    
                let consulta= "SELECT companies_id FROM companies_has_users WHERE users_id='" + req.params.id + "'"
                const [companiesId, metadata] = await db.sequelize.query(consulta)
    
                
    
                let response = {
                    meta: {
                      status : 200,
                        total: companiesId.length,
                        url: 'api/users/profile/:iduser/company'
                },
                data: companiesId
                }
                res.json(response);               
        },        
    // profile: (req, res) => {
        // db.User.findByPk(req.params.id, {
        //     include: [{ association: 'privileges' }]
        // })
        // .then(function (user) {
                    
                        
             
        //      let response = {
        //          meta: {
        //              status : 200,
        //              total: user.length,
        //              url: 'api/user/profile/:iduser'
        //          },
        //          data: user
        //      }
        //     res.json(response);
           
        // })
        // .catch(function (e) {
        //         console.log(e)
        // })
    
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
       
        // let imageProfile

        // if (req.file == undefined) {
        //     imageProfile = 'user.png'
        // } else {
        //     imageProfile = req.file.filename
        // }

        // // encrypto la contraseña 
        // let userToEdit = {
        //     ...req.body,
        //     password: bcryptjs.hashSync(req.body.password, 10),
        //     image: imageProfile,
        // }
        // db.User.update(userToEdit, {
        //     where: {
        //         id: req.params.id
        //     }
        // })
        //     .then(function () {
        //         return res.redirect('/users')
        //     })
        //     .catch(function (e) {
        //         console.log(e)
        //     })
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
    updatepoints: async (req, res) => {
       
        let consulta= `UPDATE users SET points = '` + parseInt(req.params.points) + `' WHERE id = '` + req.params.id + `'`
        const [user, metadata] = await db.sequelize.query(consulta)
                 let response = {
                    meta: {
                        status : 200,
                        total: user.length,
                        url: 'api/users/:id/points/:points'
                    },
                    data: user
                    }
                    res.json(response);               
            },
}
module.exports = controller