const mongoose = require("mongoose");
const review = require("./review")
const User = require("./user");

const listingschema =  new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true            
    },
    description: {
        type: String,
    },
    image: {                 
        filename: { type: String },
        url: { type: String },
    },
    price: {
        type: Number,
        default: 1500,
        set: v => (v < 500 ? 1500 : v)  
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    review:[{
        type:mongoose.Schema.ObjectId,
        ref:'Review'
    }],
    owner:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    coordinate: {
    type: {
      type: String, 
      enum: ['Point'], 
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
})


listingschema.post("findOneAndDelete" , async(doc)=>{
    if(doc.review.length && doc){
        let res = await review.deleteMany({_id:{$in:doc.review}});
        console.log("middle ware");
        console.log(res);
    }});


const listing = mongoose.model("listing", listingschema);
module.exports = listing;