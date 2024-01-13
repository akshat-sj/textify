const express = require('express');
const app = express();
const User = require("../../schemas/user");
const bodyParser = require('body-parser');
const Post = require('../../schemas/postschema');
const router = express.Router();
app.use(bodyParser.urlencoded({extended:false}));
router.get("/",async(req,res,next)=>{
    try {
        var results = await getPosts({});
        res.status(200).send(results);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})
router.get("/:id",async(req,res,next)=>{
    try {
        var postId = req.params.id;
        var results = await getPosts({_id:postId});
        results=results[0];
        console.log(results);
        res.status(200).send(results);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})
router.post("/",async(req,res,next)=>{
    if(!req.body.content){
        console.log("content param not sent");
        res.sendStatus(400);
        return;
    }
    var postData={
        content:req.body.content,
        postedby :req.session.user
    }
    Post.create(postData)
    .then(async(newpost)=>{
        newpost = await User.populate(newpost,{path:"postedby"})
        res.status(201).send(newpost);
    })
    .catch((error)=>{
        console.log(error);
        res.sendStatus(200);
    })
    
})
router.put("/:id/like",async(req,res,next)=>{
    var postid = req.params.id;
    var userid = req.session.user && req.session.user._id;
    var isliked = req.session.user.likes && req.session.user.likes.includes(postid);
    var option = isliked?"$pull":"$addToSet";
    req.session.user = await User.findByIdAndUpdate(userid,{[option]:{likes:postid}},{new:true})
    var post = await Post.findByIdAndUpdate(postid,{[option]:{likes:userid}},{new:true})
    res.status(200).send(post)
})
async function getPosts(filter){
    var results = await Post.find(filter)
    .populate("postedby")
    .sort({"createdAt":-1})
    .catch(error=>{
        console.log(error)
    })
    return results
}
module.exports = router;
