const { generateRandomPassword, sendConfirmationMail, requireMessages, generateConfirmationCode } = require("../helpers");
const AuthAgent = require("../models/auth-agent"),
    UsedEmail = require("../models/used-email"),
    Agent = require("../models/agent");
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
        return res.json({ msg: "Authorized Agent updated successfully!" })
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


    let json = {...req.body, auth_agent_ID: req.params.id, city: req.profile.city };
    //generating random password
    json.created_by = req.params.id
    json.password = generateRandomPassword();
    const agent = new Agent(json)
    agent.save((err, createdAgent) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                err: "error while creating agent!"
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

//get agents list
exports.getAgentsList = (req, res) => {

    Agent.find({ auth_agent_ID: req.params.id }, (err, result) => {
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

//change password
exports.changeAuthAgentPassword = (req, res) => {
    const { noAccountFound, passwordNotCorrect, updatedSuccess } = requireMessages(req.body.lang)
    AuthAgent.findById(req.params.id, (err, authAgent) => {
        if (err || !authAgent)
            return res.status(400).json({ err: noAccountFound });
        if (!authAgent.authenticate(req.body.old_password))
            return res.status(400).json({ err: passwordNotCorrect })
        let salt = uuidv1(),
            hashed_password = crypto
            .createHmac('sha1', salt)
            .update(req.body.password)
            .digest("hex");
        authAgent.hashed_password = hashed_password;
        authAgent.salt = salt;
        authAgent.save();
        return res.json({ msg: updatedSuccess });
    })
}


//add new email
exports.addEmail = (req, res) => {
    const code = generateConfirmationCode()
    AuthAgent.findById(req.params.id, (err, authAgent) => {
        //if no account found
        if (err || !authAgent) return res.status(400).json({ err: requireMessages(req.body.lang).noAccountFound });
        if (authAgent.email == req.body.email) return res.status(400).json({ err: "You are already using this email!" })

        //else
        authAgent.newEmail = req.body.email;
        authAgent.newEmailConfirmation = code;
        authAgent.newEmailConfirmationExpiration = Date.now() + 180000;
        authAgent.save()
        sendConfirmationMail(req.body.email, code, req.body.lang);
        return res.json({ msg: "confirmation code sent to email!" })
    });
}

//confirm the new email
exports.confirmNewEmail = (req, res) => {
    AuthAgent.findOne({ _id: req.params.id, newEmailConfirmationExpiration: { $gt: Date.now() } })
        .then(authAgent => {
            if (!authAgent) return res.status(400).json({ msg: "This code have been expired, you can request a new one!" });
            if (authAgent.newEmailConfirmation != req.body.code) return res.status(400).json({ err: "Confirmation code is not correct!" });
            authAgent.email = authAgent.newEmail;
            authAgent.newEmail = undefined;
            authAgent.newEmailConfirmation = undefined;
            authAgent.newEmailConfirmationExpiration = undefined;
            authAgent.save().then(result => {
                return res.json({ msg: requireMessages(req.body.lang).emailModified })
            }).catch(err => {
                return res.status(400).json({ err: requireMessages(req.body.lang).emailAlreadyExist });
            });
        })
}

//resend confirmation code
exports.resendConfirmEmail = (req, res) => {
    AuthAgent.findById(req.params.id, (err, authAgent) => {
        if (err || !authAgent) return res.status(400).json({ msg: requireMessages(req.body.lang).noAccountFound });

        //if an account found
        var code = generateConfirmationCode();

        if (req.body.type == "new-email") {
            if (authAgent.newEmail) {
                //if 60 seconds doesn't pass yet
                if (Date.parse(authAgent.newEmailConfirmationExpiration) - 120000 > (Date.now()))
                    return res.status(400).json({ err: "you have to wait 60 seconds!" });
                //else
                authAgent.newEmailConfirmation = code;
                authAgent.newEmailConfirmationExpiration = Date.now() + 180000;
                authAgent.save();
                sendConfirmationMail(authAgent.newEmail, code, req.body.lang);
            } else return res.status(400).json({ err: "want to resend code, but no newEmail found!" });
        } else {
            authAgent.confirmation_code = code;
            authAgent.save();
            sendConfirmationMail(authAgent.email, code, req.body.lang);
        }
        return res.json({ msg: requireMessages(req.body.lang).emailSent })
    })
}