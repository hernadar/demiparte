module.exports = (sequelize, dataTypes) => {
    
    let alias = 'Product';
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
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
        image: {
            type: dataTypes.STRING
        },
        image: {
            type: dataTypes.STRING
        },
        points: {
            type: dataTypes.INTEGER,
            
        },
        companies_id: {
            type: dataTypes.INTEGER,
            }
        
    }
    let config ={
        tablename: 'products',
        timestamp: false,
        createdAt: false,
        updatedAt: false,
    }
    const Product=sequelize.define (alias, cols, config);
    Product.associate = function(models){
        Product.belongsTo(models.Company, {
            as: 'companies',
            foreignKey:'companies_id',
            
        })
    }

    return Product
}