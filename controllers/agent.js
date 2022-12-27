const Agent = require("../models/agent")
const multer = require("multer")
const fs = require("fs")
const { agentUploadID, agentUploadPassprt } = require("../helpers/uploader");
const { getCitiesList } = require("../validators/cities");
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
        if (err || !agent) {
            return res.status(400).json({ err: "Agent not found" })
        }
        req.profile = {...agent._doc, type: "agent" };
        next();
    })
}

//get agents list
exports.getAgentsList = (req, res) => {
    Agent.find(req.body, projection, (err, result) => {
        if (err || !result) {
            return res.status(400).json(err)
        }
        let citiesList = getCitiesList(req.params.lang)
        let agents = result.map(user => {
            let city = citiesList.find(e => e.wilaya_code == user.city).wilaya_name
            return {...user._doc, city }
        })
        return res.json(agents)
    })
}

//set agent Inactive
exports.deactivateAgent = (req, res) => {
    console.table(req.body)
    Agent.updateOne({ _id: req.body.agent_id }, { $set: { status: { active: false } } },
        (err, result) => {
            if (err || !result) return res.status(400).json({ err: "cannot find this user" })
            return res.json({ response: "Agent deativated!" })
        })
}

//set agent active
exports.activateAgent = (req, res) => {
    Agent.updateOne({ _id: req.body.agent_id }, { $set: { status: { active: true } } },
        (err, result) => {
            if (err || !result) return res.status(400).json({ err: "cannot find this user" })
            return res.json({ response: "Agent ativated!" })
        })
}

//update agent's info (first_name, last_name, birth_date)
exports.updateAgent = (req, res) => {
    let json = {}

    if (req.body.first_name) json.first_name = req.body.first_name
    if (req.body.last_name) json.last_name = req.body.last_name
    if (req.body.birth_date) json.birth_date = req.body.birth_date

    Agent.updateOne({ _id: req.params.id }, { $set: json }, (err, result) => {
        if (err || !result) {
            return res.status(400).json({ err })
        }
        return res.json({ response: "Agent updated successfully!" })
    })
}


//uploading profile picture
exports.uploadProfilePicture = (req, res) => {
    profilePicUpload(req, res, (err) => {
        if (err) return res.status(400).json({ err })
    });
    Agent.updateOne({ _id: req.params.id }, { $set: { img: true } }, (err, result) => {
        if (err) {
            return res.status(400).json({ err: "Error occured while uploading picture!" })
        } else {
            return res.json({ response: "Picture uploaded succussfully!" })
        }
    })
}