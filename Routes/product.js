const express = require("express");
const router = express.Router();
const {upload} = require("../middleware/multer");
const {Registration,uploads,comment,reply_on_comment,Follow,deletepost,Update_Profile_Pic,Serach_bar
    ,EditName,retweet } = require("../Controller/controller"); 

router.route("/register").post(upload,Registration);
router.route("/upload").put(upload,uploads);
router.route("/comment").post(comment);
router.route("/reply").post(reply_on_comment);
router.route("/follow").put(Follow);
router.route("/deletepost").post(deletepost);
router.route("/updateprofilepic").post(upload,Update_Profile_Pic);
router.route("/search_bar").get(Serach_bar);
router.route("/EditName").post(EditName);
router.route("/retweet").post(retweet)


module.exports = router;