var Sequelize = require('sequelize');
var sequelize = new Sequelize('<database_name>', '<user>', '<password>', {
    host: 'localhost',
    dialect: 'mysql'});

var User = sequelize.define('User',{
    name: {
        type: Sequelize.STRING
    },
    email:{
        type: Sequelize.STRING
    },
    password:{
        type: Sequelize.STRING
    },
});
sequelize.sync()

module.exports = User