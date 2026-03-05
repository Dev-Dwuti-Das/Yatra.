const listmodel = require("../model/schema");
var flash = require('express-flash');
const Review = require("../model/review.js");
module.exports.create = (async(req,res)=>{
    let {id} = req.params;
    let data = await listmodel.findById(id)
    let {rating,review} = req.body;
    let rev = new Review({
        rating:rating,
        review:review,
        author:req.user._id, 
    });
    
    data.review.push(rev);
    console.log(rev);
    console.log("working");
    await rev.save();
    await data.save();
    req.flash("success", "successfully posted review"); 
    res.redirect(`/listing/details/${id}`);
});

module.exports.delete = (async(req,res)=>{
    let {id,revid} = req.params;
    await Review.findByIdAndDelete(revid);
    await listmodel.findByIdAndUpdate(id, { $pull:{review :revid}});
    req.flash("success", "successfully deleted"); 
    res.redirect(`/listing/details/${id}`);
    console.log("working");
});
