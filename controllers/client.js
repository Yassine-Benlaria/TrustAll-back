const Client = require("../models/client")
const crypto = require("crypto")
const { generateConfirmationCode, sendConfirmationMail, projectObject, sendResetPasswordEmail, requireMessages } = require("../helpers");
const { profilePicUpload } = require("../helpers/uploader");
const { getCommuneByID } = require("../validators/cities");
const { v1: uuidv1 } = require("uuid");

var projection = {
    salt: false,
    hashed_password: false,
    updatedAt: false,
    __v: false,
    confirmation_code: false
};

//signup
exports.signup = (req, res) => {
    //generating confirmation code
    const code = generateConfirmationCode()

    //saving client to database
    let json = req.body
    json.confirmation_code = code
    const client = new Client(json)
    client.save((err, createdClient) => {
        if (err || !createdClient) {
            return res.status(400).json({
                err: requireMessages(req.body.lang).emailAlreadyExist
            })
        }
        //sending confirmation email
        sendConfirmationMail(json.email, code, req.body.lang)
        res.json({ msg: requireMessages(req.body.lang).registerSuccess })
    });
}

//email confirmation
exports.confirmEmail = (req, res) => {
    let id = req.params.id
    let code = req.body.code
    let msg = requireMessages(req.body.lang)
    Client.findById(id, (err, client) => {
        if (err || !client)
            return res.status(400).json({ err: "client not found!!" })
        if (client.confirmation_code != code)
            return res.status(400).json({ err: msg.confirmCodeUncorrect })
        Client.updateOne({ _id: id }, { $set: { "status.verified": true } },
            (err, result) => {
                if (err || !result)
                    return res.status(400).json({ err: "undefined error!!" })
                return res.json({ msg: "Your account is verified!!" })
            })
    })
}

//clientById
exports.clientByID = (req, res, next, id) => {

    Client.findById(id, projection).exec((err, client) => {
        if (err || !client) {
            return res.status(400).json({ err: "Client not found" })
        }

        //get address info
        let address = getCommuneByID(client.commune_id)
        let commune, daira, city;
        if (req.params.lang == "fr" || req.params.lang == "en") {
            commune = address.commune_name_ascii;
            daira = address.daira_name_ascii;
            city = address.wilaya_name_ascii;
        } else {
            commune = address.commune_name;
            daira = address.daira_name;
            city = address.wilaya_name;
        }
        req.profile = {...client._doc, type: "client", city, daira, commune }
        next();
    })
}

//get clients list (with filter)
exports.getClientsList = (req, res) => {

    Client.find(req.body, projection, (err, result) => {
        if (err || !result) {
            return res.status(400).json(err)
        }
        return res.json(result)
    })
}

//update client info (first_name, last_name or birth_date)
exports.updateClient = (req, res) => {
    let json = {}

    if (req.body.first_name && (req.body.first_name != req.profile.first_name))
        json.first_name = req.body.first_name
    if (req.body.last_name && (req.body.last_name != req.profile.last_name))
        json.last_name = req.body.last_name
    if (req.body.birth_date && (new Date(req.body.birth_date).toISOString() != new Date(req.profile.birth_date).toISOString()))
        json.birth_date = req.body.birth_date
    if (req.body.commune_id && (req.body.commune_id != req.profile.commune_id))
        json.commune_id = req.body.commune_id

    if (Object.keys(json).length == 0) return res.status(400).json({ err: [requireMessages(req.body.lang).nothingToChange] });


    Client.updateOne({ _id: req.params.id }, { $set: json }, (err, result) => {
        if (err || !result) {
            return res.status(400).json({ err })
        }
        return res.json({ msg: requireMessages(req.body.lang).updatedSuccess })
    })
}

//uploading profile picture
exports.uploadProfilePicture = (req, res) => {
    profilePicUpload(req, res, (err) => {
        if (err) return res.status(400).json({ err })
    });
    Client.updateOne({ _id: req.params.id }, { $set: { img: true } }, (err, result) => {
        if (err) {
            return res.status(400).json({ err: "Error occured while uploading picture!" })
        } else {
            return res.json({ response: "Picture uploaded succussfully!" })
        }
    })
}

//requesting to reset password
exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) res.status(400).json({ err });
        let token = buffer.toString("hex");
        Client.findOne({ email: req.body.email })
            .then(user => {
                if (!user) return res.status(400).json({ err: "No user found with this email!" });
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            }).then(result => {
                //sending email to the user
                sendResetPasswordEmail(req.body.email, token);
                return res.json({ msg: "reset link sent to email!" })
            }).catch(err => res.status(400).json({ err }))
    })
}


//change password
exports.changeClientPassword = (req, res) => {
    const { noAccountFound, passwordNotCorrect, updatedSuccess } = requireMessages(req.body.lang)
    Client.findById(req.params.id, (err, client) => {
        if (err || !client)
            return res.status(400).json({ err: noAccountFound });
        if (!client.authenticate(req.body.old_password))
            return res.status(400).json({ err: passwordNotCorrect })
        let salt = uuidv1(),
            hashed_password = crypto
            .createHmac('sha1', salt)
            .update(req.body.password)
            .digest("hex");
        client.hashed_password = hashed_password;
        client.salt = salt;
        client.save();
        return res.json({ msg: updatedSuccess });
    })
}

//add new email
exports.addEmail = (req, res) => {
    const code = generateConfirmationCode()
    Client.findById(req.params.id, (err, client) => {
        //if no account found
        if (err || !client) return res.status(400).json({ err: requireMessages(req.body.lang).noAccountFound });
        if (client.email == req.body.email) return res.status(400).json({ err: "You are already using this email!" })

        //else
        client.newEmail = req.body.email;
        client.newEmailConfirmation = code;
        client.newEmailConfirmationExpiration = Date.now() + 180000;
        client.save()
        sendConfirmationMail(req.body.email, code);
        return res.json({ msg: "confirmation code sent to email!" })
    });
}

//confirm the new email
exports.confirmNewEmail = (req, res) => {
    Client.findOne({ _id: req.params.id, newEmailConfirmationExpiration: { $gt: Date.now() } })
        .then(client => {
            if (!client) return res.json({ msg: "not found" });
            if (client.newEmailConfirmation != req.body.code) return res.status(400).json({ err: "Confirmation code is not correct!" });
            client.email = client.newEmail;
            client.newEmail = undefined;
            client.newEmailConfirmation = undefined;
            client.newEmailConfirmationExpiration = undefined;
            client.save();
            return res.json({ msg: "Email address has been modified!" })
        })
}