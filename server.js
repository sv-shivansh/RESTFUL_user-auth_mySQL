const express = require('express')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const User= require('./models/user')
const jwt = require('jsonwebtoken')
const middleware = require('./middleware/auth')


const app = express() 
app.use(express.json( { extended: false } ));

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
        if(user){return res.json('USER ALREADY EXIST')}
            user = new User({
                name: name,
                email: email,
                password: password,
            })
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password,salt);
            await user.save();
            console.log('USER CREATED');
            const payload = {
                user:{
                    id:user.id
                }
            }
            jwt.sign(payload,'mysecretkey',{expiresIn: 36000}, (err,token)=>{
                if(err) throw err; 
                res.json({token})});
}catch(err){console.error(err.message+'\n'+err);
            res.send('server error');}
}
)

app.get('/login', middleware, async (req,res)=>{
    try{
        const user = await User.findOne({where: {id :req.user.id}});
        res.json({user:{
            name: user.name,
            email: user.email
        }})
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

app.post('/login',[check('email', 'Please include valid email address').not().isEmpty(),
    check('password','Password is required').exists()],
    async (req,res) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.json({msg:errors.array()})
        }
        const {email, password} = req.body;
        try{
            let user = await User.findOne({where :{email}});
            if(!user){ return res.json({msg:"No user exist with this email"})};
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch){res.json({msg:"Invalid Credentials"})};

            const payload= {
                user:{
                    id:user.id
                }
            }
            jwt.sign(payload,'mysecretkey',{expiresIn:36000},(err,token)=>{
                if(err) throw err;
                res.json({token});
            })
        }catch(err){res.send('server error')}
    }    
)
const PORT = process.env.PORT ||5000;
app.listen(PORT,()=>{console.log(`API running at ${PORT}`)});
