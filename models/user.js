const mongoose = require('mongoose');
const { Schema, model} = mongoose;

const UserSchema = new Schema({
    username: {type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    display_name: {type: String},
    first_name: {type: String},
    last_name: {type: String},
    
    
},
{ timestamps: true }
);

const UserModel = model('User', UserSchema);

module.exports = UserModel;