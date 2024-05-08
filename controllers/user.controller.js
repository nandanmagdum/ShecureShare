const express = require("express");
const mongoose = require("mongoose");
const userModel = require("../models/user.model.js");

const getAllUsersController = async(req, res) => {
    try {
        const allUsers = await userModel.find();
        if(!allUsers){
            return res.status(400).json("Error getting all users");
        }
        const users = allUsers.map((user) => {
            return {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                createdAt: user.createdAt,
            }
        });
        return res.status(200).json(users);
    } catch (error) {
        console.error(error.message);
        return res.status(400).json(error.message);
    }
}

const getUserController = async(req, res) => {
    const userID = req.params.userID;
    try {
        const user = await userModel.findById(userID);
        if(!user){
            return res.status(400).json("User doesn't exists");
        }
        return res.status(200).json({
            _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                createdAt: user.createdAt,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(400).json(error.message);
    }
}

module.exports = {
    getAllUsersController,
    getUserController
}