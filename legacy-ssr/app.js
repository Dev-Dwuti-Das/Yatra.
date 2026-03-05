require('dotenv').config()
console.log(process.env.KEY)     //ENV FILE 

const express = require("express");
const app = express();
exports.app = app;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
engine = require("ejs-mate");
const listing = require("./router/listing.js");
const userrout = require("./router/user.js");
const { name } = require("ejs");
const user = require("./model/user.js");
const flash = require('connect-flash');
require('dotenv').config();
const db_url = process.env.ATLAS_URL;
console.log("--------------->",db_url);



let port = 3000;
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use("/listing",listing);
app.use("/",userrout);

app.use(flash());
main()
    .then(()=>{
        console.log("mongo connected!")
    })
    .catch((err)=>{
        console.log(err)
    });

async function main() {
    await mongoose.connect(db_url);   
}

app.get("/", (req, res) => {
  res.redirect("/listing");
});


app.use((err,req,res,next)=>{
    let {statuscode = 500,message = 'something went wrong'} = err;
    res.render("error.ejs",{message});
});

app.listen(port,(req,res)=>{
    console.log("server live")
})


