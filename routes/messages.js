const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// model
const MessageModel = require('../models/message')

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

router.get('/get-messages', (req, res) => {
    const msgList = MessageModel.find({})
    .populate('author', 'email')
    .then((result) => {
        res.status(200).json({
            success: true,
            dataList: result
        })
    })
    .catch((error) => {
        res.json({
            success: false,
        })
    })
})

router.get('/get-messages/:userId', (req, res) => {

    const { userId } = req.params;
    // console.log(userId);
    const msgList = MessageModel.find({author: userId})
    .populate('author', 'email')
    .then((result) => {
        
        res.status(200).json({
            success: true,
            dataList: result
        })
    })
    .catch((error) => {
        res.json({
            success: false,
        })
    })
})

// get a message
router.get('/:msgId', (req, res) => {

    const { msgId } = req.params;
    
    const msgList = MessageModel.findById({_id:msgId})
    .then((result) => {
        
        res.status(200).json({
            success: true,
            msgData: result
        })
    })
    .catch((error) => {
        res.json({
            success: false,
        })
    })
})

router.put('/:msgId', (req, res) => {

    const { msgId } = req.params;
    const { message } = req.body;
    // filter , update
    const msgList = MessageModel.updateOne({
        _id:msgId,        
    },{
        content: message
    })
    .then((result) => {
        
        res.status(200).json({
            success: true,
            
        })
    })
    .catch((error) => {
        res.json({
            success: false,
        })
    })
})

// remove a message
router.delete('/:msgId', (req, res) => {

    const { msgId } = req.params;
    
    const msgList = MessageModel.deleteOne({_id:msgId})
    .then((result) => {
        
        res.status(200).json({
            success: true,
        })
    })
    .catch((error) => {
        res.json({
            success: false,
        })
    })
})

router.post('/create-message', (req, res) => {
    const { token } = req.cookies;
    const { message } = req.body;
    

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
        
        MessageModel.create({
            content: message,
            author: info.id,
        })

        res.json({
            success: true,
            
        })
    })
});

module.exports = router