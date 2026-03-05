const mongoose = require("mongoose");

const reviewschema = new mongoose.Schema({
    rating:{
        type:Number,
        max:5,
        min:1,
    },
    review:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    author:{
            type:mongoose.Schema.ObjectId,
            ref:'User'
        }

});

const Review = mongoose.model("Review",reviewschema); 
module.exports = Review;