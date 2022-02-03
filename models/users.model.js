const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : String,
    password : String,
    name : String,
    email : String,
    gender : String,
    about : String,
    strength : Array 
})

const userModel = mongoose.model('usersCollection',userSchema);

module.exports = userModel;