const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = async(req, res, next) => {
    const token = req.headers.authorization;
    try {
        if(!token){
            return res.status(401).json("Token Absent");
        }
        const payload = jwt.verify(token, process.env.JWT_KEY);
        if(!payload){
            return res.status(401).json("Token expired");
        }
        req._id = payload._id;
        req.email = payload.email;
        req.firstName = payload.firstName;
        req.lastName = payload.lastName;
        next();
    } catch (error) {
        console.error(error.message);
        return res.status(400).json(error.message);
    }
}

const filterAuth = async(req, res, next) => {
    console.log(req.path);
    if(req.path.startsWith("/auth")) {
        next();
    }
    else {
       return  authMiddleware(req, res, next);
    }
}

module.exports = {
    authMiddleware,
    filterAuth
}