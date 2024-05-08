const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const authMiddleware = require("./middlewares/auth.middleware.js");

const router = require("./routers/router.js"); 

require("dotenv").config();

const app = express();
const PORT = 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    console.log(req.path);
    next();
});


// routes
app.use("/api/v1", authMiddleware.filterAuth ,router);

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log("MongoDB Connected !");
    app.listen(PORT, () => {
        console.log(`Server listening at ${PORT}`);
    });
})
.catch((error) => {
    console.error(error.message);
})

