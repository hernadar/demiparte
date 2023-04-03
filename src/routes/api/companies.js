var express = require('express');
var router = express.Router();
const path =require('path');
const companiesApiController=require('../../controllers/api/companiesApiController');
const productsApiController=require('../../controllers/api/productsApiController');
const recommendationApiController=require('../../controllers/api/recommendationApiController');
const changesApiController=require('../../controllers/api/changesApiController');
const authMiddleware = require('../../middlewares/authMiddleware');

// Requiero Multer para recibir la imagen del perfil de usuario y lo configuro
const multer=require('multer');

const storageCompany = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, path.join(__dirname, '../../../public/images/logos'));
  },
  filename: function(req,file,cb){
    
    cb(null, `${Date.now()}_img${path.extname(file.originalname)}`);

  }
})
const  uploadFileCompany = multer ({storage: storageCompany});

const storageProduct = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'public/images/products');
  },
  filename: function(req,file,cb){
    
    cb(null, `${Date.now()}_img${path.extname(file.originalname)}`);

  }
})
const  uploadFileProduct = multer ({storage:storageProduct});

//Requiero Express_validator para validar los datos que vienen del formulario y cnfiguro las validaciones que debe realizar

const { body }=require ('express-validator');
const validationsCompany=[
  body('name').notEmpty().withMessage('Tienes que escribir un Nombre de empresa'),
  body('areas_id').notEmpty().withMessage('Tienes que escribir un rubro'),
  body('description').notEmpty().withMessage('Tienes que escribir una breve descripcion'),
  body('pricePoint')
          .notEmpty().withMessage('Tienes que escribir un precio').bail()
          .isNumeric().withMessage('Tienes que escribir valor numérico del precio'),
  body('image').custom((value, {req}) =>{
    let file = req.file;
    let acceptedExtensions=['.jpg','.png','.gif','.webp']
    
    if (!file) {
   
    } else {
      let fileExtension = path.extname(file.originalname)
     
        if (!acceptedExtensions.includes(fileExtension)) {
        throw new Error('Tienes que subir una imagen en formato válido .jpg, .png, .gif')
        } 
    }
    
      
    return true;
  })
]

const validationsProduct=[
  body('name').notEmpty().withMessage('Tienes que escribir un Nombre de producto'),
  body('points')
          .notEmpty().withMessage('Tienes que escribir una cantidad de puntos de canje').bail()
          .isNumeric().withMessage('Tienes que escribir valor numérico de puntos'),
  body('image').custom((value, {req}) =>{
   console.log(req.file)
    let file = req.file;
    let acceptedExtensions=['.jpg','.png','.gif','.webp']
    
    if (!file) {
      console.log('no viene imagen de producto')
    } else {
      
      let fileExtension = path.extname(file.originalname)
     
        if (!acceptedExtensions.includes(fileExtension)) {
        throw new Error('Tienes que subir una imagen en formato válido .jpg, .png, .gif')
        } 
    }
    
      
    return true;
  })
]

// Lista de Empresas
router.get('/', companiesApiController.list);
// Lista de Rubros de empresas
router.get('/areas', companiesApiController.listAreas);
// Formulario de registro de Empresa
router.get('/register', companiesApiController.register);
//Procesar el registro
router.post('/register/:userId', uploadFileCompany.single('image'), validationsCompany, companiesApiController.create);

// Perfil de Empresa
router.get('/profile/:idCompany', companiesApiController.profile);
// Editar Perfil de Empresa
router.get('/profile/edit/:idCompany',authMiddleware, companiesApiController.edit);
router.post('/profile/edit/:idCompany',authMiddleware, uploadFileCompany.single('image'), validationsCompany, companiesApiController.update);
// Eliminar perfil de Empresa
router.post('/profile/delete/:idCompany',authMiddleware, companiesApiController.delete);


//Rutas de los productos de cada Empresa
// Lista de Productos
router.get('/:idCompany/products', productsApiController.list);
// Formulario de registro de Producto
router.get('/:idCompany/products/register',authMiddleware, productsApiController.register);
//Procesar el registro de Producto
router.post('/:idCompany/products/register/', uploadFileProduct.single('image'), validationsProduct, productsApiController.create);
// imagen de producto
router.get('/:idCompany/products/image', productsApiController.image);
// detalle de productos 
router.get('/:idCompany/products/detail/:idProduct', authMiddleware, productsApiController.detail);
// Editar detalle de producto
router.get('/:idCompany/products/edit/:idProduct',authMiddleware, productsApiController.edit);
router.post('/:idCompany/products/edit/:idProduct',authMiddleware, uploadFileProduct.single('image'), validationsProduct, productsApiController.update);
// Eliminar Producto
router.post('/:idCompany/products/delete/:idProduct',authMiddleware, productsApiController.delete);
// Buscar Productos para canje dependiendod de los puntos disponibles
router.get('/:idCompany/products/change/:points', productsApiController.findUserPoints);
// Buscar Recomendaciones por Empresa
router.get('/:idCompany/recommendation', recommendationApiController.findByCompany);
// listar todos los canjes de una empresa
router.get('/:idCompany/changes/', changesApiController.list);
// listar el detalle de un canje
router.get('/:idCompany/changes/:idChange', changesApiController.detail);
// crear un registro en la tabla de canjes
router.post('/:idCompany/changes/:idUser', changesApiController.create);


module.exports = router;