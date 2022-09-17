const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const asynHandler = require('express-async-handler');
const dbConfig = require('../backend/config/dbConfig');
const Users = require('./models/userModel');
const SERVER = require('./config/server');
const jwt = require('jsonwebtoken');


const app = express();
app.listen(SERVER.port, err => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`Server is running on port: ${SERVER.port}`);
    }
});

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors());

mongoose.connect(dbConfig.MONGODB_URL)
    .then(data => console.log(`MONGO DB IS CONNECTED.`))
    .catch(err => console.log(`Error while connecting to MONGO DB : ${err}`));


// LOGIN API CALL
app.post('/api/login', asynHandler( async (req, res) => {    
    const {username,email,passowrd} = req.body

    const user = await Users.findOne(req.body)
    if(user){
        // localStorage.setItem(user:generateToken(id))
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
            

        })
    }
    else{
        res.status(400)
        throw new Error('Invalid credentials')
    }
})
)


// REGISTER API CALL
app.post('/api/register',asynHandler( async (req, res) => {
    const {username, email, password} = req.body

    if(!username || !email || !password) {
        throw new Error ('Please add all fields')
    }
    
    const userExist = await Users.findOne(req.body);
    if(userExist){
        res.status(400)
        throw new Error('User already exists');
    }

    const user = await Users.create({
        username,
        password,
        email,
        
    })

    if(user){
        res.status(201).json({
            _id : user.id,
            username : user.username,
            password: user.password,
            email: user.email,
            token: generateToken(user._id)
        })
    }
    else{
        res.status(400)
        throw new Error ('Invalid user data')
    }
})
)

// GENERATE JWT
const generateToken = (id)=>{    
    return jwt.sign({id}, SERVER.JWT_SECRET, {
        expiresIn: '30d',
    })
}