var express = require('express');
var router = express.Router();
const authRootMiddleware = require('../middlewares/authRootMiddleware');
/* GET home page. */
router.get('/', authRootMiddleware,function(req, res, next) {
   
    res.render('index');
  
    
});

module.exports = router;
