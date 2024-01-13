const express = require('express');
const app = express();
const User = require("../schemas/user");
const bodyParser = require('body-parser');
const router = express.Router();
app.use(bodyParser.urlencoded({extended:false}));
router.get("/",(req,res,next)=>{
    if(req.session){
        req.session.destroy(()=>{
            res.redirect("/login")
        })
    }
})

module.exports = router;
