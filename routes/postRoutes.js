const express = require('express');
const app = express();
const User = require("../schemas/user");
const bodyParser = require('body-parser');
const router = express.Router();
app.use(bodyParser.urlencoded({extended:false}));
router.get("/:id",(req,res,next)=>{
    var payload ={
        pagetitle: "View Post",
        userLoggedIn :req.session.user,
        userLoggedInJs :JSON.stringify(req.session.user),
        postId :req.params.id
    }
    res.status(200).render("postpage",payload);
})

module.exports = router;
