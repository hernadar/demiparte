module.exports = (sequelize, dataTypes) => {
    
    let alias = 'Area';
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: dataTypes.STRING
        },
               
    }
    let config ={
        tablename: 'areas',
        timestamp: false,
        createdAt: false,
        updatedAt: false,
    }
    const Area=sequelize.define (alias, cols, config);
    Area.associate = function(models){
        Area.hasMany(models.Company, {
            as: 'companies',
            foreignKey:'areas_id',
            
        })
    }
    
    return Area

}