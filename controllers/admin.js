const Agent = require("../models/agent")
const Admin = require("../models/admin")
const Plan = require("../models/plan")
const AuthAgent = require("../models/auth-agent")
const crypto = require("crypto")
const { generateRandomPassword, sendConfirmationMail, projectObject, generateConfirmationCode, requireMessages } = require("../helpers");
const { scanOptions } = require("../helpers/options")
const { v1: uuidv1 } = require("uuid");
const { getCitiesList } = require("../validators/cities")


const projection = {
    salt: false,
    hashed_password: false,
    updatedAt: false,
    __v: false,
};

//create an admin
exports.createAdmin = (req, res) => {
    console.log("mmak")
    let admin = new Admin(req.body);

    admin.save((err, createdAdmin) => {
        if (err) {
            console.table({ err })
            return res.status(400).json({ err })
        }
        return res.json(projectObject(createdAdmin, {
            _id: 1,
            first_name: 1,
            last_name: 1,
            email: 1,
            phone: 1,
            city: 1,
            birth_date: 1,

        }))
    })
}

//creating new agent
exports.createAgent = (req, res) => {
    let json = req.body;
    //generating random password
    json.created_by = req.params.id
    json.password = generatefRandomPassword();

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

        ////saving to DB
        res.json(projectObject(createdAgent, {
            _id: 1,
            first_name: 1,
            last_name: 1,
            email: 1,
            phone: 1,
            city: 1,
            birth_date: 1
        }))
    })
}

//creating new auth-agent
exports.createAuthAgent = (req, res) => {
    let json = req.body;
    //generating random password
    json.created_by = req.params.id
    json.password = generateRandomPassword();

    const authAgent = new AuthAgent(json)
    authAgent.save((err, created) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                err: "Email already exists!"
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
    })
}

//Admin by id
exports.adminByID = (req, res, next, id) => {

    Admin.findById(req.params.id, projection, (err, result) => {
        if (err || !result) {
            return res.status(400).json({ err })
        }
        let city = getCitiesList(req.params.lang).find(e => e.wilaya_code == result.city).wilaya_name
        req.profile = {...result._doc, city, type: "admin" }
        next();
    })
}

//update admin
exports.updateAdmin = (req, res) => {
    console.table(req.body)
    let json = {}

    if (req.body.first_name) json.first_name = req.body.first_name
    if (req.body.last_name) json.last_name = req.body.last_name
    if (req.body.birth_date) json.birth_date = req.body.birth_date
    if (isNumeric(req.body.city)) {
        if (parseFloat(req.body.city) < 1 || parseFloat(req.body.city) > 58)
            return res.status(400).json({ err: "invalid city" })
        json.city = req.body.city
    }
    Admin.updateOne({ _id: req.params.id }, { $set: json }, (err, result) => {
        if (err || !result) {
            return res.status(400).json({ err })
        }
        return res.json({ msg: requireMessages(req.body.lang).updatedSuccess })
    })
}

//create new plan
exports.createPlan = (req, res) => {
    let json = {...req.body,
        car_information: scanOptions.car_information
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

//add new email
exports.addEmail = (req, res) => {
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
            admin.email = admin.newEmail;
            admin.newEmail = undefined;
            admin.newEmailConfirmation = undefined;
            admin.newEmailConfirmationExpiration = undefined;
            admin.save();
            return res.json({ msg: "Email address has been modified!" })
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