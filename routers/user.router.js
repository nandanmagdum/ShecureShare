const express = require("express");

const userController = require("../controllers/user.controller.js");

const userRouter = express.Router();

userRouter.get("/all", userController.getAllUsersController);

userRouter.get("/:userID", userController.getUserController);

module.exports = userRouter;