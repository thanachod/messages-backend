const express = require('express')
const server = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

require('dotenv').config()
server.use(cors({
    credentials: true, 
    origin: 'http://localhost:3000'
}));
server.use(express.json());
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: false }))

// routes
const users = require('./routes/users');
const messages = require('./routes/messages');

server.use('/users', users);
server.use('/messages', messages);

server.listen(process.env.PORT||4000, () => {
    console.log(`API is on port ${process.env.PORT}.`);
})