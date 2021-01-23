const mysql = require('mysql');
const express = require('express')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const User= require('./models/user')

const app = express() 

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'user_auth'
});

connection.connect(function(err) {
    if(err){ return console.log('error:' + err.message)}
    console.log('connected to mySQL server');
})
app.get('/',(req,res)=>{res.send(`API is running`)});
app.post('/register',[
    check('name','Name is required').not().isEmpty(),
    check('email','email is required').not().isEmpty(),
    check('password','password is required').isLength({min:6})
],
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.json({errors:errors.array()})
    }
    const {name, email, password}= req.body;
    try {
        let user = await User.findOne({where : {email}})
        if(user){res.json('USER ALREADY EXIST')}
            var CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; }};
            let user = new User({
                name: name,
                email: email,
                password: password,
                time: CURRENT_TIMESTAMP
            })
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password,salt);
            connection.query('INSERT INTO users SET ?', user, (err,res)=>{
                if(err) throw err;
            })
            console.log('USER CREATED');
}catch(err){console.error(err.message+'\n'+err);
            res.send('server error');}
}
)
/*
var CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };
var data = {name: 'a', email : 'dsfnj', password : '12345', time: CURRENT_TIMESTAMP};

var query =connection.query('INSERT INTO users SET ?', data, (err,res,fields)=>{
    if(err) throw err;
})
console.log(query.sql);
*/
const PORT = process.env.PORT ||5000;
app.listen(PORT,()=>{console.log(`API running at ${PORT}`)});
/*
var query =connection.query('SELECT * from users where name = ?','A', (err,result)=>{
    if(err) throw err;
    var name = result.NAME;
    var pass = result.password;
    console.log(name,pass)
})
console.log(query.sql);
*/