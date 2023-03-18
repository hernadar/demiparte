module.exports = (sequelize, dataTypes) => {
    
        let alias = 'User';
        let cols = {
            iduser: {
                type: dataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: dataTypes.STRING
            },
            lastname: {
                type: dataTypes.STRING
            },
            phone: {
                type: dataTypes.STRING
            },
            email: {
                type: dataTypes.STRING
            },
            password: {
                type: dataTypes.STRING
            },
            image: {
                type: dataTypes.STRING
            },
            points: {
                type: dataTypes.INTEGER,
                
            },
            privilege: {
                type: dataTypes.INTEGER,
                }
            
        }
        let config ={
            tablename: 'users',
            timestamp: false,
            createdAt: false,
            updatedAt: false,
        }
        const User=sequelize.define (alias, cols, config);
        User.associate = function(models){
            User.belongsTo(models.Privilege, {
                as: 'privileges',
                foreignKey:'privilege',
                
            })
        }
        
        

        
        

        return User

}