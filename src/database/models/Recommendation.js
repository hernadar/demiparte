module.exports = (sequelize, dataTypes) => {
    
    let alias = 'Recommendation';
    let cols = {
        users_id: {
            type: dataTypes.INTEGER,      
        },
        companies_id: {
            type: dataTypes.INTEGER,
        },
        code: {
            type: dataTypes.STRING,
        },
        dateCreate: {
            type: dataTypes.DATE,
        },
        datePresent: {
            type: dataTypes.DATE,
        },
        dateConfirm: {
            type: dataTypes.DATE,
        },
        status: {
            type: dataTypes.STRING,
        },       
    }
    let config ={
        tablename: 'recommendations',
        timestamp: false,
        createdAt: false,
        updatedAt: false,
    }
    const Recommendation=sequelize.define (alias, cols, config);
    Recommendation.associate = function(models){
        Recommendation.belongsTo(models.User, {
            as: 'users',
            foreignKey:'users_id',            
        })
        Recommendation.belongsTo(models.Company, {
            as: 'companies',
            foreignKey:'companies_id',            
        })
    }
    
    return Recommendation

}