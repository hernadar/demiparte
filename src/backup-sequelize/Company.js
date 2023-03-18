module.exports = (sequelize, dataTypes) => {
    
        let alias = 'Companies';
        let cols = {
            idcompany: {
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
            pricepoint: {
                type: dataTypes.DOUBLE
            },
            image: {
                type: dataTypes.STRING
            },
        }
        let config ={
            tablename: 'companies',
            timestamp: false,
            createdAt: false,
            updatedAt: false,
        }
        const Company=sequelize.define (alias, cols, config);
        
        
    return Company
}
