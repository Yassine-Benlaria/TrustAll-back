const Client = require("../models/client")
const crypto = require("crypto")
const { generateConfirmationCode, sendConfirmationMail, projectObject, sendResetPasswordEmail, requireMessages } = require("../helpers");
const { profilePicUpload } = require("../helpers/uploader");
const { getCommuneByID } = require("../validators/cities");

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

    //get address info
    let address = getCommuneByID(req.body.commune_id)
    let commune = address.commune_name_ascii,
        daira = address.daira_name_ascii,
        city = address.wilaya_name_ascii
        //saving client to database
    let json = {...req.body, commune, daira, city }
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
        if (err) {
            return res.status(400).json({ err: "Client not found" })
        }
        req.profile = {...client._doc, type: "client" }
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

    if (req.body.first_name) json.first_name = req.body.first_name
    if (req.body.last_name) json.last_name = req.body.last_name
    if (req.body.birth_date) json.birth_date = req.body.birth_date
    if (req.body.city) {
        json.city = req.body.city
        if (req.body.daira) {
            json.daira = req.body.daira
            if (req.body.commune) json.commune = req.body.commune
        }
    }


    Client.updateOne({ _id: req.params.id }, { $set: json }, (err, result) => {
        if (err || !result) {
            return res.status(400).json({ err })
        }
        return res.json({ response: "Client updated successfully!" })
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

//setting new password
exports.setNewPassword = (req, res) => {
    let token = req.params.token;
    Client.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(client => {
            if (!client) return res.json({ msg: "not found" })
            else return res.json({ msg: "true" })
        })
        .catch(err => console.log(err));
}