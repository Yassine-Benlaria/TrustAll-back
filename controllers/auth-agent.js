const AuthAgent = require("../models/auth-agent");
const { getCitiesList } = require("../validators/cities");
const projection = {
    salt: false,
    hashed_password: false,
    updatedAt: false,
    __v: false,

};

exports.authAgentByID = (req, res, next, id) => {
    AuthAgent.findById(id, projection, (err, result) => {
        if (err || !result) {
            return res.status(400).json({ err })
        }
        req.profile = {...result._doc, type: "auth-agent" }
        next();
    })
}

//get agents list
exports.getAuthAgentsList = (req, res) => {
    AuthAgent.find(req.body, projection, (err, result) => {
        if (err || !result) {
            return res.status(400).json(err)
        }
        let citiesList = getCitiesList(req.params.lang)
        let authAgents = result.map(user => {
            let city = citiesList.find(e => e.wilaya_code == user.city).wilaya_name
            return {...user._doc, city }
        })
        return res.json(authAgents)
    })
}

//update authAgent's info (first_name, last_name, birth_date)
exports.updateAuthAgent = (req, res) => {
    let json = {}

    if (req.body.first_name) json.first_name = req.body.first_name
    if (req.body.last_name) json.last_name = req.body.last_name
    if (req.body.birth_date) json.birth_date = req.body.birth_date

    AuthAgent.updateOne({ _id: req.params.id }, { $set: json }, (err, result) => {
        if (err || !result) {
            return res.status(400).json({ err })
        }
        return res.json({ response: "Authorized Agent updated successfully!" })
    })
}

//uploading profile picture
exports.uploadProfilePicture = (req, res) => {
    profilePicUpload(req, res, (err) => {
        if (err) return res.status(400).json({ err })
    });
    AuthAgent.updateOne({ _id: req.params.id }, { $set: { img: true } }, (err, result) => {
        if (err) {
            return res.status(400).json({ err: "Error occured while uploading picture!" })
        } else {
            return res.json({ response: "Picture uploaded succussfully!" })
        }
    })
}