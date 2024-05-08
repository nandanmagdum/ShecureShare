const express = require("express");

const authRouter = require("./auth.router.js");
const fileRouter = require("./file.router.js");
const userRouter = require("./user.router.js");


const router = express.Router();

router.use("/file", fileRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);

module.exports = router;