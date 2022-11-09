const Client = require("../models/client")

const { generateConfirmationCode, sendConfirmationMail, projectObject } = require("../helpers");
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
    console.log(json)
    json.confirmation_code = code
    const client = new Client(json)
    client.save((err, createdClient) => {
        if (err) {
            return res.status(400).json({
                err: "Email already exists!"
            })
        }
        //sending confirmation email
        sendConfirmationMail(json.email, code)
        res.json(projectObject(createdClient, {
            _id: 1,
            first_name: 1,
            last_name: 1,
            email: 1,
            phone: 1,
            city: 1,
            daira: 1,
            commune: 1,
            birth_date: 1
        }))
    });
}

//email confirmation
exports.confirmEmail = (req, res) => {
    let id = req.params.id
    let code = req.body.code
    Client.findById(id, (err, client) => {
        if (err || !client)
            return res.status(400).json({ err: "client not found!!" })
        if (client.confirmation_code != code)
            return res.status(400).json({ err: "Confirmation code is not correct!!" })
        Client.updateOne({ _id: id }, { $set: { "status.verified": true } },
            (err, result) => {
                if (err || !result)
                    return res.status(400).json({ err: "undefined error!!" })
                return res.json({ response: "Your account is verified!!" })
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