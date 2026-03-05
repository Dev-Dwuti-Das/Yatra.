const listmodel = require("../model/schema");
require('dotenv').config();
var flash = require('express-flash');
const mbxClient = require('@mapbox/mapbox-sdk/services/geocoding')
const geocodingClient = mbxClient({ accessToken: process.env.MAP_TOKEN});



module.exports.search = (async(req, res) => {
  try {
    const searchTerm = req.query.searchbox || "";

    // Log the query for debugging
    console.log("Search term:", searchTerm);

    const results = await listmodel.find({
        $or:[
        {location: { $regex: searchTerm, $options: "i" }},
        {country: { $regex: searchTerm, $options: "i" }},
        {title: { $regex: searchTerm, $options: "i" }}
        ]
    });

    res.render("search", { results, searchTerm });
    
  } catch (err) {
    console.error("Search error:", err); 
    res.status(500).send("Server error");
  }
});




module.exports.create = (async(req,res,next) => {
        let {title,description,price,location,country} = req.body;
        let result  = await geocodingClient.forwardGeocode({
        query: location,
        limit: 1
        })
        .send()
        
        let filename = req.file.filename;
        let url = req.file.path;
        let obj = new listmodel({
            title:title,
            description:description,
            price:price,
            location:location,
            country:country,
        });
        console.log("filenmae :",filename);
        console.log(url);
        obj.owner = req.user._id;
        obj.image.filename = filename;
        obj.image.url = url;
        obj.coordinate = result.body.features[0].geometry;
        console.log("GeoData:", result.body.features[0].geometry);
        console.log("Final object:", obj);
        await obj.save();
        
        req.flash("success", "listing successfull");  
        res.redirect("/listing"); 
});

module.exports.update = (async(req,res) => {
    let {id} = req.params;
    // let filename = req.file.filename;
    // let url = req.file.path;
    let listing = await listmodel.findById(id);
    // console.log("currentuser",res.locals.currentuser._id);
    // console.log("requested_id",requested_id.owner);
    if(!res.locals.currentuser._id.equals(listing.owner)){
        req.flash("error","dont try to be oversmart");
        return res.redirect("/login");
    };

    let {title,description,price,location,country} = req.body;

        
        listing.title=title,
        listing.description=description,
        listing.price=price,
        listing.location=location,
        listing.country=country;
        

        if(req.file){
            listing.image = {
                filename: req.file.filename,
                url:req.file.path
            }
        }

    
    await listing.save();
    
    req.flash("success", "successfull updated"); 
    res.redirect("/listing");
});

module.exports.render = ((req,res) => {
    res.render("form.ejs");
});

module.exports.delete = (async(req,res) => {
    let {id} = req.params;
    await listmodel.findByIdAndDelete(id);
    req.flash("success", "successfull deleted"); 
    res.redirect("/listing")
});

module.exports.read = (async(req,res) => {
    let data = await listmodel.find();
    res.render("listing",{data});
});

module.exports.details = (async(req,res)=>{
    let {id} = req.params;
    let data = await listmodel.findById(id).populate("owner").populate({path:"review",populate:{
        path:"author",
}});
    console.log(data.review);
    if(!data){
        req.flash("error", "This listing has been deleted !");
        return res.redirect("/listing");
    }
    console.log(data);
    res.render("details.ejs",{data,mapToken: process.env.MAP_TOKEN});
})