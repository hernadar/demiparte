module.exports = (sequelize, dataTypes) => {
    
    let alias = 'Company';
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
        recomendations: {
            type: dataTypes.INTEGER
        },
        image: {
            type: dataTypes.STRING
        },
        pricePoint: {
            type: dataTypes.DOUBLE
        }
    }
    let config ={
        tablename: 'companies',
        timestamp: false,
        createdAt: false,
        updatedAt: false,
    }
    const Company=sequelize.define (alias, cols, config);
    Company.associate = function(models){
        Company.belongsTo(models.Area, {
            as: 'areas',
            foreignKey:'areas_id',
        })
        Company.hasMany(models.Recommendation, {
            as: 'recommendations',
            foreignKey:'companies_id',
            
        })
    }

    return Company

}