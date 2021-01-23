var Sequelize = require('sequelize');
var sequelize = new Sequelize('user_auth', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql'});

var User = sequelize.define('user',{
    name: {
        type: Sequelize.STRING
    },
    email:{
        type: Sequelize.STRING
    },
    password:{
        type: Sequelize.STRING
    },
    Date: { 
        type: Sequelize.DATE, defaultValue: Sequelize.NOW 
    }
});
sequelize.sync()
module.exports = User