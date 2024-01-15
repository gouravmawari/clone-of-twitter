const express = require("express");
const multer = require("multer");

const Storage = multer.diskStorage({
    destination: "space",
    filename(req, file, cb) {
        cb(null, file.originalname)
    }
})


const upload = multer({
    storage: Storage
}).fields([{ name: 'profilephoto', maxCount: 1 }, { name: 'PostImage', maxCount: 1 }])

module.exports = { upload };