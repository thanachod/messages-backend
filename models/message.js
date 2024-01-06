const mongoose = require('mongoose');
const { Schema, model} = mongoose;

const MessageSchema = new Schema({
    content: {type: String, require: true},
    author: { 
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    }
    
    
    
},
{ timestamps: true }
);

const MessageModel = model('Message', MessageSchema);

module.exports = MessageModel;