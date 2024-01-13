const express = require('express');
const app = express();
const port = 8080;
const middleware = require('./middleware');
const path = require("path")
const mongoose =require("./database");
const session =require("express-session")
const bodyparser = require("body-parser");
const server = app.listen(port,() => console.log("server listenign on port - " + port));
app.set("view engine","pug");
app.set("views","views");
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"public")));
app.use(session({
    secret:"umbrella",
    resave: true,
    saveUninitialized:false
}))

//routes
const loginRoute =require('./routes/loginRoutes');
const registerRoute =require('./routes/registerRoutes');
const logoutRoute =require('./routes/logout');
const postRoute =require('./routes/postRoutes');
// api routes
const postsApiRoute =require('./routes/api/posts');
app.use("/login",loginRoute);
app.use("/register",registerRoute);
app.use("/logout",logoutRoute);
app.use("/posts",postRoute);
app.use("/api/posts",postsApiRoute);
app.get("/",middleware.requireLogin,(req,res,next)=>{
    var payload = {
        pagetitle:"Home",
        userLoggedIn:req.session.user,
        userLoggedInJs:JSON.stringify(req.session.user)
    }
    res.status(200).render("home",payload);
})
