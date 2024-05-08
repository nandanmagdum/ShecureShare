const express = require("express");
const multer = require("multer");
const fileService = require("../services/file_service.js");
const fs = require("fs");
const fileModel = require("../models/file.model.js");
const path = require("path");

const fileController = require("../controllers/file.controller.js");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        return cb(null, 'files/');
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({storage});

const fileRouter = express.Router();

fileRouter.post("/", upload.single('file'), async(req, res) => {
    console.log(req.file.path.substring(6) , "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    console.log(req.body);
    console.log(req.file);
    const data = req.body;
    // uploaded file to node server

    // encrypt file
    const fileData = await fs.readFileSync(req.file.path);
    console.log(fileData);
    const encrypted = await fileService.encrypt(Buffer.from(fileData));
    // encrypted succesfully

    console.log("$$$$$$$$$$$$$$$$$$$$$$$");
    console.log(encrypted);

    // store in mongo DB
    const newFile = await fileModel.create({
        owner: data.owner,
        name: data.name,
        description: data.description,
        content: encrypted,
        filetype: req.file.mimetype
    });

    if(!newFile){
        return res.status(400).json("Error creating file");
    }
    fs.unlinkSync(path.join(__dirname, '../','files', req.file.path.substring(6)));
    return res.status(200).json(newFile);
});

fileRouter.get("/all", fileController.getAllDocuments);

fileRouter.get("/user", fileController.getUserDocuments);

fileRouter.get("/shared", fileController.getSharedDocuments);

fileRouter.get("/:id", fileController.getFileController);

fileRouter.patch("/access", fileController.addAccessController);

fileRouter.patch("/remove_access", fileController.removeAccessController);


module.exports = fileRouter;