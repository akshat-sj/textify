const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    firstname:{
        type:String,
        required:true,
        trim:true
    },
    lastname:{
        type:String,
        required:true,
        trim:true
    },
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
        default:"/images/profilepic.png"
    },
    likes:[{
        type:Schema.Types.ObjectId,
        ref: 'Post'
    }]

},{timestamps:true});
var User = mongoose.model("User",UserSchema)
module.exports = User