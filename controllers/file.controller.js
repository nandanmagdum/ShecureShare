const express = require("express");
const fileModel = require("../models/file.model.js");
const fileService = require("../services/file_service.js");
const userModel = require("../models/user.model.js");

const getFileController = async(req, res) => {
    const id = req.params.id;
    try {
        const file = await fileModel.findOne({_id: id});
        if(!file) {
            return res.status(400).json("File Not Found");
        }
        // decrypt the file
        console.log(file);
        const decryptedFile = fileService.decrypt(file.content);
        console.log(decryptedFile);
        const DecryptedBuffer = Buffer.from(decryptedFile).toString('base64');
        console.log(DecryptedBuffer);
        const kfile = {
            _id: file._id,
            owner: file.owner,
            name: file.name,
            description: file.description,
            filetype: file.filetype,
            access: file.access
        }
        return res.status(200).json({...kfile, "decrpted": decryptedFile, "decryptedBuffer": DecryptedBuffer});
    } catch (error) {
        console.error(error.message);
        return res.status(400).json(error.message);
    }
}

const addAccessController = async(req, res) => {
    const { file_id , email , access_type} = req.body;
    try {
        // check if email is valid;
        const user = await userModel.findOne({email: email});
        if(!user){
            return res.status(400).json("Account with this email doesn't exists");
        }
        const file = await fileModel.findOne({_id: file_id});
        if(!file){
            return res.status(400).json("file doesn't exists");
        }
        const access = file.access.map((e) => {return {"email": e.email, "permission": e.permission}});
        console.log(access);
        let A;
        let flag = false;
        for(let a of access){
            console.log(a.email.toString(), email.toString());
            if(a.email === email){
                flag = true;
                A = a;
                console.log(a);
                console.log("User has some previous access");
                break;
            }
        }
        if(flag === true){
            const removePrevious = await fileModel.findOneAndUpdate({_id: file._id}, {$pull: {access: A}}, {new: true});
            if(!removePrevious){
                return res.status(400).json("Error removing previous access");
            }
            console.log("Removed previous access");
        } 
        const updatedFile = await fileModel.findOneAndUpdate({_id: file._id}, {$push: {access: {email: email, permission: access_type}}}, {new: true});
        if(!updatedFile){
            return res.status(400).json("Error adding the user");
        } 
        return res.status(200).json("Access given succesfully");
    } catch (error) {
        console.error(error.message);
        return res.status(400).json(error.message);
    }
}

const removeAccessController = async(req, res) => {
    const { file_id ,email} = req.body;
    try {
        const file = await fileModel.findOne({_id: file_id});
        if(!file){
            return res.status(400).json("file doesn't exists");
        }
        const access = file.access.map((e) => {return {"email": e.email, "permission": e.permission}});
        console.log(access);
        let A;
        let flag = false;
        for(let a of access){
            console.log(a.email, email);
            if(a.email === email){
                flag = true;
                A = a;
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                console.log(A);
                console.log("User has some previous access");
                break;
            }
        }
        if(flag === false){
            return res.status(202).json("Permission removed !!!");
        } 
        const updatedFile = await fileModel.findOneAndUpdate({_id: file._id}, {$pull: {access: A}}, {new: true});
        if(!updatedFile){
            return res.status(400).json("Error adding the user");
        } 
        return res.status(200).json("Access removed succesfully");
    } catch (error) {
        console.error(error.message);
        return res.status(400).json(error.message);
    }
}

const getAllDocuments = async(req, res) => {
    try {
        const allDocs = await fileModel.find();
        if(!allDocs) {
            return res.status(400).json("Error getting all documents");
        }
        let docsArray = [];
        for(file of allDocs){
        console.log(file);
        const decryptedFile = fileService.decrypt(file.content);
        console.log(decryptedFile);
        const DecryptedBuffer = Buffer.from(decryptedFile).toString('base64');
        console.log(DecryptedBuffer);
        const kfile = {
            _id: file._id,
            owner: file.owner,
            name: file.name,
            description: file.description,
            filetype: file.filetype,
            access: file.access
            }
            docsArray.push({
                ...kfile,
                "decryptedBuffer": DecryptedBuffer
            });
        }
        console.log("Files sent " , docsArray.length);
        return res.status(200).json(docsArray);
    } catch (error) {
        console.error(error.message);
        return res.status(400).json(error.message);
    }
}

const getUserDocuments = async(req, res) => {
    const ownerID = req._id;
    try {
        const allDocs = await fileModel.find({owner: ownerID});
        if(!allDocs) {
            return res.status(400).json("Error getting all owner's documents");
        }
        let docsArray = [];
        for(file of allDocs){
        console.log(file);
        const decryptedFile = fileService.decrypt(file.content);
        console.log(decryptedFile);
        const DecryptedBuffer = Buffer.from(decryptedFile).toString('base64');
        console.log(DecryptedBuffer);
        const kfile = {
            _id: file._id,
            owner: file.owner,
            name: file.name,
            description: file.description,
            filetype: file.filetype,
            access: file.access
            }
            docsArray.push({
                ...kfile,
                "decryptedBuffer": DecryptedBuffer
            });
        }
        console.log("Files sent of owner's " , docsArray.length);
        return res.status(200).json(docsArray);
    } catch (error) {
        // console.error(error.message);
        return res.status(400).json(error.message);
    }
}

const getSharedDocuments = async(req, res) => {
    const emailID = req.email;
    try {
        const allDocs = await fileModel.find();
        if(!allDocs) {
            return res.status(400).json("Error getting all shared's documents");
        }
        // filter the docs
        let filterDocs = allDocs.map((doc) => {
            const accessArray = doc.access;
            if(accessArray.length != 0){
                for(obj of accessArray){
                    if(obj.email === emailID){
                        console.log(doc);
                        return doc;
                    }
                }
            }
        });

        console.log(filterDocs);
        for(f in filterDocs){
            
        }
        console.log("Filter docs length = ", filterDocs.length);
        if(filterDocs.length === 0){
            console.log("Shared documents");
            return res.status(201).json("No Shared Documents");
        }
        // filter the docs
        let docsArray = [];
        for(file of allDocs){
        const decryptedFile = fileService.decrypt(file.content);
        const DecryptedBuffer = Buffer.from(decryptedFile).toString('base64');
            const kfile = {
            _id: file._id,
            owner: file.owner,
            name: file.name,
            description: file.description,
            filetype: file.filetype,
            access: file.access
            }
            docsArray.push({
                ...kfile,
                "decryptedBuffer": DecryptedBuffer
            });
        }
        console.log("Shared Documents =  " , docsArray.length);
        return res.status(200).json(docsArray);
    } catch (error) {
        console.error(error.message);
        return res.status(400).json(error.message);
    }
}

module.exports = {
    getFileController,
    addAccessController,
    removeAccessController,
    getUserDocuments,
    getAllDocuments,
    getSharedDocuments
}