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

    AuthAgent.find(req.query, projection, (err, result) => {
        if (err || !result) {
            return res.status(400).json(err)
        }
        let citiesList = getCitiesList(req.params.lang);
        let authAgents = result.map(user => {
            let communes = user.communes.map(id => {
                return req.params.lang == "ar" ?
                    getCommuneByID(id).commune_name :
                    getCommuneByID(id).commune_name_ascii;
            });
            let city = ""
            try { city = citiesList.find(e => e.wilaya_code == user.city).wilaya_name } catch (e) { console.log(e) }

            return {...user._doc, communes, city }
        })
        return res.json(authAgents)
    })
}

//get auth agents names
exports.getAuthAgentsNames = (req, res) => {
    AuthAgent.find(req.query, { _id: true, first_name: true, last_name: true }, (err, result) => {
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