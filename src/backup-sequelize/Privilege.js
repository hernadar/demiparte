module.exports = (sequelize, dataTypes) => {
    
    let alias = 'Privilege';
    let cols = {
        idprivilege: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: dataTypes.STRING
        },
    }
    let config ={
        tablename: 'privileges',
        timestamp: false,
        createdAt: false,
        updatedAt: false,
    }
    const Privilege=sequelize.define (alias, cols, config);
    
    Privilege.associate = function(models){
        Privilege.hasMany(models.User, {
            as: 'users',
            foreignKey:'privilege',
            
        })
    }

return Privilege
}
