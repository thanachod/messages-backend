const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// model
const UserModel = require('../models/user');

require('dotenv').config()
const salt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;

// mongoDB
mongoose.connect(process.env.DB_PATH);

router.get('/', (req, res) => {
    res.json({
        message: 'hello world'
    })
})

router.get('/account', (req, res) => {
    const { token } = req.cookies;
    const { id } = req.body;
    
    
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, info) => {
            if(err) throw err;
            res.json(info);
        });
    } else {
        res.json(null);
    }

    
})

router.get('/check-auth', (req, res) => {
    const { token } = req.cookies;
    

    if (!token) {
        return res.json({
            success: false,
            message: 'No token provided'
        })
    }

    jwt.verify(token, jwtSecret, (err, info) => {
        if (err) {
            return res.json({
                success: false,
                message: 'Invalid token'
            })
        }

        res.json({
            success: true,
            user: info
        })
    })
})

router.post('/register', (req, res) => {
    const {email, password} = req.body;
    UserModel.create({
        
        email,
        password: bcrypt.hashSync(password, salt)
    }).then(result =>{
        res.status(200).json({
            message: "successful create a new user."
        })

    }).catch(err => res.json({
        message: `${err}`
    }))


})

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const userDoc = await UserModel.findOne({email})
    const passOK = bcrypt.compareSync(password, userDoc.password)
    
    if(passOK){
        jwt.sign({email,id: userDoc._id}, jwtSecret, 
            {
                expiresIn: '1h' 
            }, (err, token) => {
            if (err) throw err;
                
                res.cookie('token', token).json({
                    id: userDoc._id,
                    email,
                    
                });   
        })
    } else {
        res.status(400).json('wrong credentials');
    }
}); 

router.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

module.exports = router