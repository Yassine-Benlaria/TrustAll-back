const Agent = require("../models/agent")
const multer = require("multer")
const fs = require("fs")
const { agentUploadID, agentUploadPassprt } = require("../helpers/uploader")
const projection = {
    salt: false,
    hashed_password: false,
    updatedAt: false,
    __v: false,

};

//uploading ID card or Driving license
exports.uploadId = (req, res) => {

    agentUploadID(req, res, (err) => {
        if (err) return res.status(400).json({ err })

        return res.send("ID uploaded successfully")
    });

    Agent.updateOne({ _id: req.params.id }, { $set: { identity_document: "ID" } }, (err, result) => {
        if (err) console.log(err)
        else console.log(result)
    })
}

//uploading passport
exports.uploadPassport = (req, res) => {
    agentUploadPassprt(req, res, (err) => {
        if (err) return res.status(400).json({ err })

        return res.send("Passport uploaded successfully")
    });
    Agent.updateOne({ _id: req.params.id }, { $set: { identity_document: "Passport" } }, (err, result) => {
        if (err) console.log(err)
        else console.log(result)
    })
}


//agentById
exports.agentByID = (req, res, next, id) => {


    Agent.findById(id, projection).exec((err, agent) => {
        if (err) {
            return res.status(400).json({ err: "Agent not found" })
        }
        req.profile = agent;
        next();
    })
}

//get agents list
exports.getAgentsList = (req, res) => {

    Agent.find(req.body, projection, (err, result) => {
        if (err || !result) {
            return res.status(400).json(err)
        }
        return res.json(result)
    })
}