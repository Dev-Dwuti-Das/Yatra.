module.exports.isLogedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        console.log(req.path);
        console.log(req.originalUrl);
        if(req.originalUrl){
            res.locals.redirecturl = req.originalUrl;
        }
        req.flash("error","Please login first!");
    return res.redirect("/login");
    }
    next();
}