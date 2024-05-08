const express = require("express");
const userController = require("../controllers/auth.controller.js");

const authRouter  = express.Router();

authRouter.get("/test", (req, res) => {
    return res.status(200).json("Hello, World !");
})

authRouter.post("/create", userController.createUserController);

authRouter.post("/login", userController.loginUserController);

authRouter.post("/send_otp", userController.sendOTPController);

authRouter.post("/verify", userController.verifyOTPController);

authRouter.post("/reset_password", userController.changePasswordController);

module.exports = authRouter;