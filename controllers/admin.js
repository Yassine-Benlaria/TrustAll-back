//models
const Agent = require("../models/agent"),
    Admin = require("../models/admin"),
    Plan = require("../models/plan"),
    AuthAgent = require("../models/auth-agent"),
    Client = require("../models/client"),
    UsedEmail = require("../models/used-email");

//deleted-models
const DeletedClient = require("../models/deleted/deleted-client"),
    DeletedAgent = require("../models/deleted/deleted-agent"),
    DeletedAuthAgent = require("../models/deleted/deleted-auth-agent"),
    DeletedAdmin = require("../models/deleted/deleted-admins");

//#################
const crypto = require("crypto")
const { v1: uuidv1 } = require("uuid");
const { generateRandomPassword, sendConfirmationMail, projectObject, generateConfirmationCode, requireMessages, sendEmailMessage } = require("../helpers");
const { scanOptions } = require("../helpers/options")
const { getCitiesList, getCommuneByID } = require("../validators/cities");
const { profilePicUpload } = require("../helpers/uploader");
const { uploadProfilePic } = require("../helpers/imageUploader");

const projection = {
    salt: false,
    hashed_password: false,
    updatedAt: false,
    __v: false,
};

//create an admin
exports.createAdmin = async(req, res) => {
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
    });


    let json = req.body
    console.table(req.body)

    //generating random password
    let password = generateRandomPassword();

    let admin = new Admin({...json, created_by: req.params.id, password: password });

    admin.save((err, createdAdmin) => {

        if (err) {
            console.table({ err })
            return res.status(400).json({ err })
        }
        sendConfirmationMail(json.email, json.password)
        res.json({ msg: "Sub-Admin created successfully!" });
        //adding email to used emails
        usedEmail = new UsedEmail({ email: req.body.email })
        usedEmail.save();
    })
}

//creating new agent
exports.createAgent = async(req, res) => {

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
    });

    // console.table(req.body)
    let json = req.body;
    //generating random password
    json.created_by = req.params.id
    json.password = generateRandomPassword();
    const agent = new Agent(json)
    agent.save((err, createdAgent) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                err: "Email already exists!"
            })
        }

        //sending email to agent
        sendConfirmationMail(json.email, json.password)

        res.json({ msg: "Agent created successfully!" })
            ///saving to DB
            // res.json(projectObject(createdAgent, {
            //     _id: 1,
            //     first_name: 1,
            //     last_name: 1,
            //     email: 1,
            //     phone: 1,
            //     city: 1,
            //     birth_date: 1
            // }))
            //adding email to used emails
        usedEmail = new UsedEmail({ email: req.body.email })
        usedEmail.save();
    })
}

//creating new auth-agent
exports.createAuthAgent = async(req, res) => {

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


    let json = req.body;
    console.table(json);
    //generating random password
    json.created_by = req.params.id
    json.password = generateRandomPassword();

    console.table(req.body)
    const authAgent = new AuthAgent({...json, created_by: req.params.id })
    authAgent.save((err, created) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                err: requireMessages(req.body.lang).emailAlreadyExist
            })
        }

        //sending email to agent
        sendConfirmationMail(json.email, json.password)

        ////saving to DB
        res.json(projectObject(created, {
            _id: 1,
            first_name: 1,
            last_name: 1,
            email: 1,
            phone: 1,
            city: 1,
            birth_date: 1
        }))

        //adding email to used emails
        usedEmail = new UsedEmail({ email: req.body.email })
        usedEmail.save();
    })
}

//Admin by id
exports.adminByID = (req, res, next, id) => {

    Admin.findById(req.params.id, projection, (err, result) => {
        if (err || !result) {
            return res.status(400).json({ err })
        }
        let city = getCitiesList(req.params.lang).find(e => e.wilaya_code == result.city).wilaya_name
        req.profile = {...result._doc, city_number: result.city, city, type: "admin" }
        next();
    })
}

//update admin
exports.updateAdmin = (req, res) => {
    console.table(req.body)
    let json = {}

    if (req.body.first_name && (req.body.first_name != req.profile.first_name))
        json.first_name = req.body.first_name
    if (req.body.last_name && (req.body.last_name != req.profile.last_name))
        json.last_name = req.body.last_name

    // console.log(admin.birth_date.toISOString())
    if (req.body.birth_date && (new Date(req.body.birth_date).toISOString() != new Date(req.profile.birth_date).toISOString()))
        json.birth_date = req.body.birth_date
    if (isNumeric(req.body.city)) {
        if (parseFloat(req.body.city) < 1 || parseFloat(req.body.city) > 58)
            return res.status(400).json({ err: "invalid city" })
        if (req.body.city != req.profile.city_number)
            json.city = req.body.city
    }

    // console.table({ length: Object.keys(json).length, json, city: req.profile.city })
    if (Object.keys(json).length < 1)
        return res.status(400).json({ err: requireMessages(req.body.lang).nothingToChange })
    Admin.updateOne({ _id: req.params.id }, { $set: json }, (err, result) => {
        if (err || !result) {
            return res.status(400).json({ err })
        }
        return res.json({ msg: requireMessages(req.body.lang).updatedSuccess })
    })


}

//create new plan
exports.createPlan = (req, res) => {
    let json = {...req.body
        /* ,
                car_information: scanOptions.car_information */
    }
    console.log(json)
    let plan = new Plan(json)
    plan.save((err, createdPlan) => {
        if (err || !createdPlan) {
            console.table({ err })
            return res.status(400).json({ err: "err while creating new plan!" })
        }
        return res.json({ msg: "plan created successfully!" })
    })
}

//delete plan
exports.deletePlan = (req, res) => {
    Plan.findByIdAndDelete(req.params.plan_id, (err, deleted) => {
        if (err || !deleted) {
            console.log(err)
            return res.status(400).json({ err: 'err' })
        }
        return res.json({ msg: "plan deleted" })
    })
}

//uploading profile picture
exports.uploadProfilePicture = (req, res) => {

    profilePicUpload(req, res, async(err) => {

        if (err) console.log(err)
        console.log(req)
            // let file = Buffer.from(req.files[0].buffer).toString("base64")
            // console.log(file)
        if (!req.file) {
            return res.status(400).json({ err: "you have to upload a picture" })
        }

        let urls = await uploadProfilePic(req.file, req.params.id);

        console.log(urls)
        Admin.updateOne({ _id: req.params.id }, {
            $set: {
                img: urls[0][1]

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
        return res.send({ msg: "picture uploaded successfully", img: urls[0][1] })
    });
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
    Admin.findById(req.params.id, (err, admin) => {
        //if no account found
        if (err || !admin) return res.status(400).json({ err: requireMessages(req.body.lang).noAccountFound });
        if (admin.email == req.body.email) return res.status(400).json({ err: "You are already using this email!" })

        //else
        admin.newEmail = req.body.email;
        admin.newEmailConfirmation = code;
        admin.newEmailConfirmationExpiration = Date.now() + 180000;
        admin.save()
        sendConfirmationMail(req.body.email, code, req.body.lang);
        return res.json({ msg: "confirmation code sent to email!" })
    });
}

//confirm the new email
exports.confirmNewEmail = (req, res) => {
    Admin.findOne({ _id: req.params.id, newEmailConfirmationExpiration: { $gt: Date.now() } })
        .then(admin => {
            if (!admin) return res.status(400).json({ msg: "This code have been expired, you can request a new one!" });
            if (admin.newEmailConfirmation != req.body.code) return res.status(400).json({ err: "Confirmation code is not correct!" });
            ///////////////////////////////////////////
            let newMail = admin.newEmail,
                oldMail = admin.email;
            ///////////////////////////////////////////
            admin.email = admin.newEmail;
            admin.newEmail = undefined;
            admin.newEmailConfirmation = undefined;
            admin.newEmailConfirmationExpiration = undefined;
            admin.save().then(result => {
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
    Admin.findById(req.params.id, (err, admin) => {
        if (err || !admin) return res.status(400).json({ msg: requireMessages(req.body.lang).noAccountFound });

        //if an account found
        var code = generateConfirmationCode();

        if (req.body.type == "new-email") {
            if (admin.newEmail) {
                //if 60 seconds doesn't pass yet
                if (Date.parse(admin.newEmailConfirmationExpiration) - 120000 > (Date.now()))
                    return res.status(400).json({ err: "you have to wait 60 seconds!" });
                //else
                admin.newEmailConfirmation = code;
                admin.newEmailConfirmationExpiration = Date.now() + 180000;
                admin.save();
                sendConfirmationMail(admin.newEmail, code, req.body.lang);
            } else return res.status(400).json({ err: "want to resend code, but no newEmail found!" });
        } else {
            admin.confirmation_code = code;
            admin.save();
            sendConfirmationMail(admin.email, code, req.body.lang);
        }
        return res.json({ msg: requireMessages(req.body.lang).emailSent })
    })
}

//change password
exports.changeAdminPassword = (req, res) => {
    const { noAccountFound, passwordNotCorrect, updatedSuccess } = requireMessages(req.body.lang)
    Admin.findById(req.params.id, (err, admin) => {
        if (err || !admin)
            return res.status(400).json({ err: noAccountFound });
        if (!admin.authenticate(req.body.old_password))
            return res.status(400).json({ err: passwordNotCorrect })
        let salt = uuidv1(),
            hashed_password = crypto
            .createHmac('sha1', salt)
            .update(req.body.password)
            .digest("hex");
        admin.hashed_password = hashed_password;
        admin.salt = salt;
        admin.save();
        return res.json({ msg: updatedSuccess });
    })
}

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

//get sub-admins list
exports.getSubAdminsList = (req, res) => {
    Admin.find({ role: "sub_admin" }, projection, (err, result) => {
        if (err) {
            return res.status(400).json({ err: "Error occured!" });
        }

        let citiesList = getCitiesList(req.params.lang)
        let subAdmins = result.map(user => {
            let city = citiesList.find(e => e.wilaya_code == user.city).wilaya_name
            return {...user._doc, city }
        })
        return res.json(subAdmins)
    })
}


//delete User
exports.deleteUser = (req, res) => {
    if (req.query.client_id) deleteClient(req, res);
    else if (req.query.agent_id) deleteAgent(req, res);
    else if (req.query.auth_agent_id) deleteAuthAgent(req, res);
    else if (req.query.admin_id) deleteAdmin(req, res);
    else res.status(400).json({ err: "error while error is error so not error" });
}

//delete client account
const deleteClient = (req, res) => {
    Client.findById(req.query.client_id, (err, user) => {
        if (err || !user)
            return res.status(400).json({ err: "user not found!!" });

        //insert into deleted clients
        const deleted = new DeletedClient({...user._doc })
        deleted.save((err, result) => {
            if (err) {
                console.log(err)
            } else console.log("client account deleted!")
        })

        //delete from clients table
        Client.findByIdAndDelete(req.query.client_id, (err, response) => {
            if (err) return res.status(400).json({ err: err });
            res.json({ msg: "client account deleted" });
            //delete email from used emails
            console.table({ doc: user._doc.email })
            console.table({ doc: user._doc.email })
            console.table({ email: user.email })
            UsedEmail.findOneAndDelete({ email: user._doc.email }, (err, email) => {
                if (err) return console.table({ err: err });
            });
        })
    });
}

//delete agent account
const deleteAgent = (req, res) => {
    Agent.findById(req.query.agent_id, (err, user) => {
        if (err || !user)
            return res.status(400).json({ err: "user not found!!" });

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
            res.json({ msg: "agent account deleted" });
            //delete email from used emails
            UsedEmail.findOneAndDelete({ email: user._doc.email }, (err, email) => {
                if (err) return console.table({ err: err });
            });
        })
    });
}

//delete auth-agent account
const deleteAuthAgent = (req, res) => {
    AuthAgent.findById(req.query.auth_agent_id, (err, user) => {
        if (err || !user)
            return res.status(400).json({ err: "user not found!!" });

        //insert into deleted auth agents
        const deleted = new DeletedAuthAgent({...user._doc })
        deleted.save((err, result) => {
            if (err) {
                console.log(err)
            } else console.log("Auth-agent account deleted!")
        })

        //delete from clients table
        AuthAgent.findByIdAndDelete(req.query.auth_agent_id, (err, response) => {
            if (err) return res.status(400).json({ err: err });
            res.json({ msg: "Auth-agent account deleted" });
            //delete email from used emails
            UsedEmail.findOneAndDelete({ email: user._doc.email }, (err, email) => {
                if (err) return console.table({ err: err });
            });
        })
    });
}

//delete auth-agent account
const deleteAdmin = (req, res) => {
    if (req.profile.role != "main_admin")
        return res.status(400).json({ err: "You are not authorized to complete this task!" })

    Admin.findById(req.query.admin_id, (err, user) => {
        if (err || !user)
            return res.status(400).json({ err: "user not found!!" });

        //insert into deleted auth agents
        const deleted = new DeletedAdmin({...user._doc })
        deleted.save((err, result) => {
            if (err) {
                console.log(err)
            } else console.log("Admin account deleted!")
        })

        //delete from clients table
        Admin.findByIdAndDelete(req.query.admin_id, (err, response) => {
            if (err) return res.status(400).json({ err: err });
            res.json({ msg: "Admin account deleted" });
            //delete email from used emails
            UsedEmail.findOneAndDelete({ email: user._doc.email }, (err, email) => {
                if (err) return console.table({ err: err });
            });
        })
    });
}

//get unverified agents and authagents
exports.getUnverifiedEmployees = (req, res) => {
    Agent.aggregate([{
            $set: { type: "agent" }

        }, {
            $match: {
                "status.verified": false
            }

        },
        {
            $project: {
                salt: 0,
                hashed_password: 0,
                updatedAt: 0,
                __v: 0,
            }

        }, {
            $lookup: {
                from: "authagents",
                localField: "auth_agent_ID",
                foreignField: "_id",
                as: "auth_agent"
            },

        },
        {
            $set: {
                auth_agent: {
                    $concat: [{ $arrayElemAt: ["$auth_agent.first_name", 0] },
                        " ",
                        { $arrayElemAt: ["$auth_agent.last_name", 0] }
                    ]
                }
            }
        },
    ], (err, agents) => {
        if (err || !agents) return res.status(400).json({ err });
        AuthAgent.aggregate([{
            $set: { type: "auth-agent" }

        }, {
            $match: {
                "status.verified": false
            }

        }, {
            $project: {
                salt: 0,
                hashed_password: 0,
                updatedAt: 0,
                __v: 0,
            }

        }], (err, authAgents) => {
            if (err || !agents) return res.status(400).json({ err });

            let result = [...agents, ...authAgents]
            let citiesList = getCitiesList(req.params.lang)

            result = result.map(user => {
                if (user.type == "auth-agent") {
                    let city = citiesList.find(e => e.wilaya_code == user.city).wilaya_name
                    let communes = user.communes.map(id => {
                        return req.params.lang == "ar" ?
                            getCommuneByID(id).commune_name :
                            getCommuneByID(id).commune_name_ascii;
                    });
                    return {...user, city, communes }
                }

                let city = citiesList.find(e => e.wilaya_code == user.city).wilaya_name
                return {...user, city }

            })
            return res.json(result)
        })
    })
}

exports.acceptAuthAgentID = (req, res) => {

    AuthAgent.findById(req.body.user_id, (err, authAgent) => {
        if (err || !authAgent) return res.status(400).json({ err })
        sendEmailMessage(authAgent.email, "ID Accepted", "Your Identity Document has been accepted by admin")
        authAgent.status.verified = true
        authAgent.save()
        return res.send("auth-agent ID accepted");
    })
}


exports.acceptAgentID = (req, res) => {
    AuthAgent.findById(req.body.user_id, (err, agent) => {
        if (err || !agent) return res.status(400).json({ err })
        console.table(agent)
        sendEmailMessage(agent.email, "ID Accepted", "Your Identity Document has been accepted by admin")
        agent.status.verified = true
        agent.save()
        return res.send("agent ID accepted");
    })
}

exports.declineAuthAgentID = (req, res) => {
    AuthAgent.findById(req.body.user_id, (err, authAgent) => {

        if (err) return res.status(400).json({ err })
        sendEmailMessage(authAgent.email, "ID declined", "Your Identity Document has been declined by admin, please try to upload it again, and make sure to make it more clear and readable.")
        authAgent.status.verified = false
        authAgent.id_uploaded = false
        authAgent.identity_document = {}
        authAgent.save()
        return res.send("auth-agent ID declined");
    })
}

exports.declineAgentID = (req, res) => {
    Agent.findById(req.body.user_id, (err, agent) => {

        if (err) return res.status(400).json({ err })
        sendEmailMessage(agent.email, "ID declined", "Your Identity Document has been declined by admin, please try to upload it again, and make sure to make it more clear and readable.")
        agent.status.verified = false
        agent.id_uploaded = false
        agent.identity_document = {}
        agent.save()
        return res.send("agent ID declined");
    })
}

//get notifications list
exports.getNotificationList = (req, res) => {
    Admin.findById(req.params.id, {
        notifications: {
            subject: true,
            isRead: true,
            createdAt: true,
            _id: true
        }
    }, (err, user) => {
        if (err || !user) {
            console.log(err)
            res.status(400).json({ err: "err" })
        }
        return res.json(user.notifications)
    })
}


//get notification by id
exports.getNotificationByID = (req, res) => {
    Admin.findOne({
        _id: req.params.id,
        "notifications._id": req.params.notification_id
    }, { notifications: true }, (err, user) => {
        if (err || !user) {
            console.log(err)
            return res.status(400).json({ err: "err" })
        }
        res.json(user.notifications.find(({ _id }) => _id.toString() == req.params.notification_id))

        user._doc = {...user._doc,
            notifications: user.notifications.map(notf => {
                if (notf._id.toString() == req.params.notification_id)
                    return {...notf._doc, isRead: true }
                return notf
            })
        }
        console.log(user)
        user.save()
    })
}