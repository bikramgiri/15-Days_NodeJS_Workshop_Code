const {Sequelize, DataTypes} = require('sequelize')

const ghar = new Sequelize('ghar', 'root', '', { // database name, username bydefault:root, password bydefault: empty string
    host: 'localhost',  // database host 
    port: 3306        // database port bydefault: 3306
})





