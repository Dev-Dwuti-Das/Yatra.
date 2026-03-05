
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Userschema = new Schema({
    email:{
        type:"string",
        required:true,
    },
    
});

Userschema.plugin(passportLocalMongoose);

const User = mongoose.model('User', Userschema);
module.exports = User;