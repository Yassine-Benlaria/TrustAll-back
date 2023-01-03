const AuthAgent = require("../models/auth-agent");
const { getCitiesList, getCommuneByID } = require("../validators/cities");
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

//get auth agents list
exports.getAuthAgentsList = (req, res) => {
    AuthAgent.find(req.body, projection, (err, result) => {
        if (err || !result) {
            return res.status(400).json(err)
        }
        let authAgents = result.map(user => {
            let communes = user.communes.map(id => {
                return req.params.lang == "ar" ?
                    getCommuneByID(id).commune_name :
                    getCommuneByID(id).commune_name_ascii;
            });
            // let communes = citiesList.find(e => e.wilaya_code == user.city).wilaya_name
            return {...user._doc, communes }
        })
        return res.json(authAgents)
    })
}

//get auth agents names
exports.getAuthAgentsNames = (req, res) => {
    AuthAgent.find(req.body, { _id: true, first_name: true, last_name: true }, (err, result) => {
        if (err || !result) {
            return res.status(400).json(err)
        }

        return res.json(result)
    })
}

//set auth-agent Inactive
exports.deactivateAuthAgent = (req, res) => {
    console.table(req.body)
    AuthAgent.updateOne({ _id: req.body.auth_agent_id }, { $set: { status: { active: false } } },
        (err, result) => {
            if (err || !result) return res.status(400).json({ err: "cannot find this user" })
            return res.json({ response: "Authorized Agent deativated!" })
        })
}

//set auth-agent Inactive
exports.activateAuthAgent = (req, res) => {
    console.table(req.body)
    AuthAgent.updateOne({ _id: req.body.auth_agent_id }, { $set: { status: { active: true } } },
        (err, result) => {
            if (err || !result) return res.status(400).json({ err: "cannot find this user" })
            return res.json({ response: "Authorized Agent ativated!" })
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


json = {
    "_id": { "$oid": "63a96554bc5103f8fcbada0d" },
    "first_name": "Mohammed El Amine",
    "birth_date": { "$date": { "$numberLong": "886377600000" } },
    "email": "chenafi@gmail.com",
    "phone": "0674471451",
    "city": "01",
    "img": false,
    "status": { "verified": false, "active": false, "_id": { "$oid": "63aad2b2c8189ee3fe4f9a26" } },
    "salt": "53e2d3c0-84fd-11ed-bf0d-b16136fe9b35",
    "hashed_password": "24a059efb63bd8dd9b3eb5e298bc441f9983819a",
    "createdAt": { "$date": { "$numberLong": "1672045908750" } },
    "updatedAt": { "$date": { "$numberLong": "1672139442767" } },
    "__v": { "$numberInt": "0" },
    "last_name": "Chenafi"
}