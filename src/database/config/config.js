module.exports = {
  "development": {
    "username": "hernadar", //hernadar
    "password": "192611Dh",
    "database": "recomendame",
    "port": 3306,
    "host": "db4free.net",//db4free.net
    "dialect": "mysql",
    "ssl": true,
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
