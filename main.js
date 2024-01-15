const express = require("express");
const app = express();
const mongoose = require('mongoose');
const multer = require("multer");
const User = require("./model.js");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/',require("./Routes/product.js"))


//Connection to Data base(MongoDB)
const dbURI = "mongodb+srv://guddu:guddu@cluster1.ved7bni.mongodb.net/yes?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        const PORT = process.env.PORT || 8888;
        app.listen(PORT, () => {
            console.log("server is created")
        })
    })
    .catch((err) => console.log(err))     