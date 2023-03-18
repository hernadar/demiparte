module.exports = (sequelize, dataTypes) => {
    
        let alias = 'Products';
        let cols = {
            idproducts: {
                type: dataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: dataTypes.STRING
            },
            area: {
                type: dataTypes.STRING
            },
            description: {
                type: dataTypes.STRING
            },
            category: {
                type: dataTypes.STRING
            },
            price: {
                type: dataTypes.DOUBLE
            },
            points: {
                type: dataTypes.INTEGER
            },
            image: {
                type: dataTypes.STRING
            },
            companies_idcompany: {
                type: dataTypes.INTEGER
            },
        }
        let config ={
            tablename: 'products',
            timestamp: false,
            createdAt: false,
            updatedAt: false,
        }
        const Product=sequelize.define (alias, cols, config);
       
    return Product
}
