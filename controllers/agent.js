const Agent = require("../models/agent"),
    DeletedAgent = require("../models/deleted/deleted-agent"),
    UsedEmail = require("../models/used-email"),
    Command = require("../models/command");
const multer = require("multer")
const fs = require("fs")
const crypto = require("crypto")
const { v1: uuidv1 } = require("uuid");
const { agentUploadID, agentUploadPassprt } = require("../helpers/uploader");
const { getCitiesList } = require("../validators/cities");
const { default: mongoose } = require("mongoose");
const { generateConfirmationCode, sendConfirmationMail, requireMessages } = require("../helpers");
const projection = {
    salt: false,
    hashed_password: false,
    updatedAt: false,
    __v: false,

};

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

    Agent.aggregate([
        { $project: { _id: 1, createdAt: 1, first_name: 1, last_name: 1, city: 1, email: 1, phone: 1, birth_date: 1, auth_agent_ID: 1, status: 1 } },
        {
            $lookup: {
                from: "authagents",
                localField: "auth_agent_ID",
                foreignField: "_id",
                as: "auth_agent"
            },

        },
        {
            $set: {
                auth_agent_first_name: { $arrayElemAt: ["$auth_agent.first_name", 0] }
            }
        },
        {
            $set: {
                auth_agent_last_name: { $arrayElemAt: ["$auth_agent.last_name", 0] }
            }
        },
        {
            $set: {
                auth_agent: undefined
            }
        }, { $match: { "status.verified": true } }
    ], (err, result) => {
        if (err || !result) {
            return res.status(400).json(err)
        }
        let citiesList = getCitiesList(req.params.lang)
        let agents = result.map(user => {
            let city = citiesList.find(e => e.wilaya_code == user.city).wilaya_name
            return {...user, city }
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
        return res.json({ msg: "Agent updated successfully!" })
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

//get agents by authagent
exports.getAgentsNamesByAuthAgent = (req, res) => {

    Agent.find({ auth_agent_ID: mongoose.Types.ObjectId(req.params.id), "status.verified": true }, { _id: true, first_name: true, last_name: true },
        (err, result) => {
            if (err || !result) {
                return res.send({ err })
            }

            return res.json(result)
        })
}

//delete agent account
exports.deleteAgent = (req, res) => {
    Agent.findById(req.query.agent_id, (err, user) => {
        if (err || !user)
            return res.status(400).json({ err: "user not found!!" });

        if (user.auth_agent_ID != req.params.id)
            return res.statut(400).json({ err: "you are no authorized to complete this task" });

        //insert into deleted clients
        const deleted = new DeletedAgent({...user._doc })
        deleted.save((err, result) => {
            if (err) {
                console.log(err)
            } else console.log("Agent account deleted!")
        })

        //delete from clients table
        Agent.findByIdAndDelete(req.query.agent_id, (err, response) => {
            if (err) return res.status(400).json({ err: err });
            res.json({ msg: "agent accouts deleted" });
            //delete email from used emails
            UsedEmail.findOneAndDelete({ email: user._doc.email }, (err, email) => {
                if (err) return console.table({ err: err });
            });
        })
    });
}

//change password
exports.changeAgentPassword = (req, res) => {
    const { noAccountFound, passwordNotCorrect, updatedSuccess } = requireMessages(req.body.lang)
    Agent.findById(req.params.id, (err, agent) => {
        if (err || !agent)
            return res.status(400).json({ err: noAccountFound });
        if (!agent.authenticate(req.body.old_password))
            return res.status(400).json({ err: passwordNotCorrect })
        let salt = uuidv1(),
            hashed_password = crypto
            .createHmac('sha1', salt)
            .update(req.body.password)
            .digest("hex");
        agent.hashed_password = hashed_password;
        agent.salt = salt;
        agent.save();
        return res.json({ msg: updatedSuccess });
    })
}

//add new email
exports.addEmail = async(req, res) => {
    //test if email is used
    let usedEmail;
    try {
        usedEmail = await UsedEmail.findOne({ email: req.body.email });
    } catch (err) {
        return res.status(400).json({
            err: requireMessages(req.body.lang).emailAlreadyExist
        })
    }
    if (usedEmail) return res.status(400).json({
        err: requireMessages(req.body.lang).emailAlreadyExist
    })

    const code = generateConfirmationCode()
    Agent.findById(req.params.id, (err, agent) => {
        //if no account found
        if (err || !agent) return res.status(400).json({ err: requireMessages(req.body.lang).noAccountFound });
        if (agent.email == req.body.email) return res.status(400).json({ err: "You are already using this email!" })

        //else
        agent.newEmail = req.body.email;
        agent.newEmailConfirmation = code;
        agent.newEmailConfirmationExpiration = Date.now() + 180000;
        agent.save()
        sendConfirmationMail(req.body.email, code, req.body.lang);
        return res.json({ msg: "confirmation code sent to email!" })
    });
}

//confirm the new email
exports.confirmNewEmail = (req, res) => {
    Agent.findOne({ _id: req.params.id, newEmailConfirmationExpiration: { $gt: Date.now() } })
        .then(agent => {
            if (!agent) return res.status(400).json({ msg: "This code have been expired, you can request a new one!" });
            if (agent.newEmailConfirmation != req.body.code) return res.status(400).json({ err: "Confirmation code is not correct!" });
            ///////////////////////////////////////////
            let newMail = agent.newEmail,
                oldMail = agent.email;
            ///////////////////////////////////////////
            agent.email = agent.newEmail;
            agent.newEmail = undefined;
            agent.newEmailConfirmation = undefined;
            agent.newEmailConfirmationExpiration = undefined;
            agent.save().then(result => {
                //adding email to used emails
                usedEmail = new UsedEmail({ email: newMail })
                usedEmail.save();
                //delete old email from used emails
                UsedEmail.findOneAndDelete({ email: oldMail }, (err, email) => {
                    if (err) return console.table({ err: err });
                });
                return res.json({ msg: requireMessages(req.body.lang).emailModified })
            }).catch(err => {
                return res.status(400).json({ err: requireMessages(req.body.lang).emailAlreadyExist });
            });
        })
}

//resend confirmation code
exports.resendConfirmEmail = (req, res) => {
    Agent.findById(req.params.id, (err, agent) => {
        if (err || !agent) return res.status(400).json({ msg: requireMessages(req.body.lang).noAccountFound });

        //if an account found
        var code = generateConfirmationCode();

        if (req.body.type == "new-email") {
            if (agent.newEmail) {
                //if 60 seconds doesn't pass yet
                if (Date.parse(agent.newEmailConfirmationExpiration) - 120000 > (Date.now()))
                    return res.status(400).json({ err: "you have to wait 60 seconds!" });
                //else
                agent.newEmailConfirmation = code;
                agent.newEmailConfirmationExpiration = Date.now() + 180000;
                agent.save();
                sendConfirmationMail(agent.newEmail, code, req.body.lang);
            } else return res.status(400).json({ err: "want to resend code, but no newEmail found!" });
        } else {
            agent.confirmation_code = code;
            agent.save();
            sendConfirmationMail(agent.email, code, req.body.lang);
        }
        return res.json({ msg: requireMessages(req.body.lang).emailSent })
    })
}

//uploading ID card or Driving license
exports.uploadId = (req, res) => {

    if (req.profile.id_uploaded) return res.status(400).json({ err: "ID already uploaded" })
    agentUploadID(req, res, async(err) => {

        if (err)
            return res.status(400).json({ err })
        console.log(req)
            // let file = Buffer.from(req.files[0].buffer).toString("base64")
            // console.log(file)
        if (!req.files || req.files.length != 3) {
            return res.status(400).json({ err: "you have to upload 3 pictures" })
        }

        let urls = await uploadID(req.files, req.params.id);

        console.log(urls)
        Agent.updateOne({ _id: req.params.id }, {
            $set: {
                id_uploaded: true,
                identity_document: {
                    type: "ID",
                    [urls[0][0]]: urls[0][1],
                    [urls[1][0]]: urls[1][1],
                    [urls[2][0]]: urls[2][1],
                }
            }
        }, (err, result) => {
            if (err) console.log(err)
            else console.log(result)
        })
        return res.json({ msg: "ID uploaded successfully" })
    });
}

//uploading passport
exports.uploadPassport = (req, res) => {

    console.log(!req.profile.id_uploaded)
    if (req.profile.id_uploaded) return res.status(400).json({ err: "ID already uploaded" })
    agentUploadPassprt(req, res, async(err) => {

        if (err) console.log(err)
        console.log(req)
            // let file = Buffer.from(req.files[0].buffer).toString("base64")
            // console.log(file)
        if (!req.files || req.files.length < 2) {
            return res.status(400).json({ err: "you have to upload 2 pictures" })
        }

        let urls = await uploadID(req.files, req.params.id);

        console.log(urls)
        Agent.updateOne({ _id: req.params.id }, {
            $set: {
                id_uploaded: true,
                identity_document: {
                    type: "passport",
                    [urls[0][0]]: urls[0][1],
                    [urls[1][0]]: urls[1][1],
                }
                // {
                //     type: "passport",
                //     front_url: { photo: urls[0][1], key: urls[0][2] },
                //     selfie_url: { photo: urls[1][1], key: urls[1][2] },
                // }
            }
        }, (err, result) => {
            if (err) console.log(err)
            else console.log(result)
        })
        return res.send({ msg: "Passport uploaded successfully" })
    });

}