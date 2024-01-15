const express = require("express");
const mongoose = require("mongoose");
const User = require("../model");



const Registration = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = new User({ username, password, profilephoto: { name: req.files.filename, path: "/space/" } });
        await user.save();
        res.status(200).json(user)
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

const uploads  = async (req, res) => {
    const { id, text } = req.body;

    const filename = req.body
    let post = {};
    if (text) {
        post.Text = text
    }
    if (text && req.files) {
        post = {
            Text: text,
            PostImage: req.files.filename
        }
    }
    try {

        let result = await User.findOneAndUpdate({ _id: id }, { $push: { post: [post] } })
        res.status(200).json({ message: "Post added successfully." });
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

const comment =async (req, res) => {
    const { user_id, post_owner_id, post_id, text } = req.body;

    try {
        // Find the user who is the owner of the post
        const postOwner = await User.findById(post_owner_id);

        // Check if the post owner exists
        if (!postOwner) {
            return res.status(404).json({ message: 'Post owner not found' });
        }

        // Find the specific post within the post owner's posts array
        const post = postOwner.post.id(post_id);

        // Check if the post exists
        if (!post) {
            return res.status(404).json({ message: 'Post not found within the post owner\'s posts' });
        }

        const comment = {
            content: text,
            author: user_id,  // this is the commenter's ID
            date: new Date()
        };

        post.Comments.push(comment);
        await postOwner.save(); // Save the post owner document with the updated post's comment

        res.status(200).json({ message: "Comment added successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
}

const reply_on_comment =  async (req, res) => {
    const { user_id, post_owner_id, post_id, text, cmt_id } = req.body;
    try {
        const postOwner = await User.findById(post_owner_id);

        if (!postOwner) {
            return res.status(404).json({ message: 'Post owner not found' });
        }

        const post = postOwner.post.id(post_id);

        // Check if the post exists
        if (!post) {
            return res.status(404).json({ message: 'Post not found within the post owner\'s posts' });
        }

        const cmt = post.Comments.id(cmt_id);

        if (!cmt) {
            return res.status(404).json({ message: 'Comment not found within the post' });
        }

        const reply = {
            content: text,
            author: user_id,  // this is the commenter's ID
            date: new Date()
        };

        cmt.Reply.push(reply); // This is the correction. Pushing reply to the cmt's Reply array.

        await postOwner.save();

        res.status(200).json({ message: "Reply added successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
}

const Follow =  async (req, res) => {
    const { user_ID, target_id } = req.body
    try {
        const push = await User.findOneAndUpdate({ _id: user_ID }, {
            $push: {
                following: target_id
            }
        })
        res.status(200).json({ message: "Followed successfully." });
    } catch (error) {
        res.status(500).json(error);
    }
}

const deletepost = async (req, res) => {
    const { userId, docId } = req.body;
    try {
        await User.findOneAndUpdate({
            _id: userId
        },
            {
                $pull: {
                    post: { _id: docId }
                }
            }).exec();

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
}

const Update_Profile_Pic = async (req, res) => {
    const { userId } = req.body;

    // Check if userId is provided
    if (!userId) {
        return res.status(400).json({ message: "userId is required." });
    }

    // Check if the file was uploaded
    if (!req.files) {
        return res.status(400).json({ message: "No file was uploaded." });
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    profilephoto: {
                        name: req.files.filename,
                        // path: "/space/" + req.file.filename
                        path: "/space/"
                    }
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Profile photo is updated", user: updatedUser });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const Serach_bar = async (req, res) => {
    const { usern_name } = req.query; // access the query parameters
    try {
        const user = await User.findOne({ username: usern_name }) // await the asynchronous operation
        if (user) {
            res.status(200).json(user)
        } else {
            res.status(404).send({ message: "User not found" }) // 404 is more appropriate for 'not found' errors
        }
    } catch (error) {

        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}


const EditName =  async (req, res) => {
    const { newusername, userId } = req.body;

    try {
        if (newusername === '') {
            return res.status(400).json({ message: "Please enter username" });
        } else {
            const updatedUser = await User.findOneAndUpdate({ _id: userId }, {
                $set: {
                    username: newusername
                }
            }, { new: true });  // get the updated document back

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json({ message: "Username is updated", user: updatedUser });
        }
    } catch (error) {

        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const retweet = async (req, res) => {
    const { user_ID, retweet_post_Id, tweetText } = req.body;

    try {
        const result = await User.findOneAndUpdate({ _id: user_ID }, {
            $push: {
                Retweet: {
                    Text: tweetText,
                    post_Id: retweet_post_Id
                }
            }
        })
        res.status(200).json({ message: "message has been pushed" })
    }
    catch (error) {

        res.status(500).json(error)
    }
}

module.exports = {Registration,uploads,comment,reply_on_comment,Follow,deletepost,Update_Profile_Pic,Serach_bar
,EditName,retweet}