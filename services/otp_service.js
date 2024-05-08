const express = require("express");
const mongoose = require("mongoose");
const otpModel = require("../models/otp.model.js");
const bcrypt = require("bcrypt");

const generateOTP = async() => {
     const min = 100000;
     const max = 999999;
     const otp = Math.floor(Math.random() * (max - min + 1)) + min;
     return otp;
} 

const isOTPexpired = async(otpData) => {
    console.log(otpData);
    // Add 5 minutes to the createdAt time
    const twoMinutesLater = new Date(otpData.createdAt.getTime() + (5 * 60 * 1000));
    
    // Get the current time
    const currentTime = new Date();
    console.log(currentTime - twoMinutesLater);
    // Check if two minutes have passed
    if (currentTime.getTime() >= twoMinutesLater.getTime()) {
        console.log("OTP EXpired");
      return "OTP_EXPIRED";
    } else {
        console.log("OTP not EXpired");
      return "success";
      }
    }

module.exports = {
    generateOTP,
    isOTPexpired
}