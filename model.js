const mongoose = require("mongoose");

//Reply Schema
const ReplySchema = new mongoose.Schema({
    content:{type:String},
    author:{type: mongoose.Schema.Types.ObjectId,ref:"user"},
    date: { type: Date, default: Date.now }
})

//Comment Schema
const CommentSchema = new mongoose.Schema({
    content:{type:String},
    author:{type: mongoose.Schema.Types.ObjectId,ref:"yo"},
    date: { type: Date, default: Date.now },
    Reply:[ReplySchema]
})

//User Schema
userschema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    profilephoto: {
        name: { type: String },
        path: { type: String }
    },
    post: [{
        Text: { type: String },
        PostImage: { name: { type: String }, path: { type: String } },
        Comments:[CommentSchema]
    }],
    Retweet:[{
        Text:{type:String},
        post_Id:{type: mongoose.Schema.Types.ObjectId, ref:"post"}
    }],
    following: [{
        type: String
    }]

});

const User = mongoose.model("yo", userschema);
module.exports = User;