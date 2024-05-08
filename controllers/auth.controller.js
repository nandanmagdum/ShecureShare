const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const otpModel = require("../models/otp.model.js");
const userModel = require("../models/user.model.js");
const mailService = require("../services/mail_service.js");
const otpService = require("../services/otp_service.js");

const createUserController = async(req, res) => {
    const data = req.body;
    try {
        // if user already exists
        const user = await userModel.findOne({email: data.email});
        if(user){
            return res.status(400).json("The user already exists, please login !");
        }

        // user is new
        console.log(data);
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
        console.log(data.password);
        const newUser = await userModel.create(data);
        if(!newUser){
            return res.status(400).json("Error creating new user");
        }
        return res.status(200).json(newUser);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json(error.message);
    }
}

const loginUserController = async(req, res) => {
    const {email, password } = req.body;
    try {
        // check if user exists
        const user = await userModel.findOne({email: email});
        if(!user){
            return res.status(400).json("Account doesn't exists for this email, please create the account first !");
        }
        // check if password match
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json("Wrong Password !");
        }
        // create jwt
        const token = jwt.sign({_id: user._id, email : user.email, firstName: user.firstName, lastName: user.lastName}, process.env.JWT_KEY , {expiresIn: '7d'});
        if(!token){
            return res.status(500).json("Error creating jwt token !");
        }
        // send jwt
        return res.status(200).json({"token": token});
    } catch (error) {
        console.error(error.message);
        return res.status(500).json(error.message);
    }
}

const sendOTPController =  async(req, res) => {
    const email = req.body.email;
    const purpose = req.body.purpose;
    try {
        let otp = await otpService.generateOTP();
        otp = otp.toString();
        const hashedOTP = await bcrypt.hash(otp, 10);
        await otpModel.deleteMany({email: email});

        await otpModel.create({
            email: email,
            otp: hashedOTP
        });
        const otpstatus = await mailService.sendOTP(email, otp, `OTP for ${purpose}`);
        if(otpstatus === "fail"){
            return res.status(400).json("Error sending OTP, check if email is valid");
        }
        return res.status(200).json(`OTP sent to ${email}`);
    } catch (error) {
        console.error(error.message);
        console.error(error);
        return res.status(400).json(error.message);
    }
}

// verify otp
const verifyOTPController = async(req, res) => {
    const {email, otp} = req.body;
    try {
        //check if email present
        const otpdata = await otpModel.findOne({email: email});
        if(!otpdata) {
            return res.status(400).json("Please try sending otp again !");
        }
        // check if otp expired
        const otpStatus = await otpService.isOTPexpired(otpdata);
        if(otpStatus === "OTP_EXPIRED"){
            return res.status(400).json("OTP expired please try sending otp again");
        }
        // check if otp match
        const isOTPmatch = await bcrypt.compare(otp, otpdata.otp);
        if(!isOTPmatch){
            return res.status(400).json("Wrong OTP");
        }
        // return verified status (200)
        return res.status(200).json("OTP verified");
    } catch (error) {
        console.error(error.message);
        console.error(error);
        return res.status(400).json(error.message);
    }
}

const changePasswordController = async(req, res) => {
    const {email, new_password} = req.body;
    try {
        const user = await userModel.findOne({email: email});

        if(!user ) {
            return res.status(400).json(`${email} doesn't exists`);
        }

        // bcrypt the password
        const hashedPassword = await bcrypt.hash(new_password, 10);

        // set new password
        updated_user = await userModel.findOneAndUpdate({email: email}, {$set: {password: hashedPassword}}, {new: true});

        // check if change operation is successful
        if(!user ) {
            return res.status(400).json(`Error updating password for ${email}`);
        }

        return res.status(200).json("Password changed");
    } catch (error) {
        console.error(error.message);
        console.error(error);
        return res.status(400).json(error.message);
    }
}

module.exports = {
    createUserController,
    loginUserController,
    sendOTPController,
    verifyOTPController,
    changePasswordController
}