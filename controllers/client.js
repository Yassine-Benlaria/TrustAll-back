const Client = require("../models/client"),
    UsedEmail = require("../models/used-email"),
    DeletedClient = require("../models/deleted/deleted-client");

const crypto = require("crypto")
const { generateConfirmationCode, sendConfirmationMail, projectObject, sendResetPasswordEmail, requireMessages } = require("../helpers");
const { profilePicUpload } = require("../helpers/uploader");
const { getCommuneByID } = require("../validators/cities");
const { v1: uuidv1 } = require("uuid");
const { uploadID, uploadFilesToImageKit, uploadProfilePic } = require("../helpers/imageUploader");

var projection = {
    salt: false,
    hashed_password: false,
    updatedAt: false,
    __v: false,
    confirmation_code: false,
    resetToken: false,
    resetTokenExpiration: false,
    newEmail: false,
    newEmailConfirmation: false,
    newEmailConfirmationExpiration: false,
};

//signup
exports.signup = async(req, res) => {
    //generating confirmation code
    const code = generateConfirmationCode()

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

    //saving client to database
    let json = req.body
    json.confirmation_code = code
    const client = new Client(json)
    client.save((err, createdClient) => {
        if (err || !createdClient) {
            return res.status(400).json({
                err: err
            })
        }

        //sending confirmation email
        sendConfirmationMail(json.email, code, req.body.lang)
        res.json({ msg: requireMessages(req.body.lang).registerSuccess });

        //adding email to used emails
        usedEmail = new UsedEmail({ email: req.body.email })
        usedEmail.save();
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
        let clients = result.map(client => {
            let commune = getCommuneByID(client.commune_id)
            let address = req.params.lang == "ar" ? `${commune.commune_name}, ${commune.daira_name}, ${commune.wilaya_name}` : `${commune.commune_name_ascii}, ${commune.daira_name_ascii}, ${commune.wilaya_name_ascii}`
            return {...client._doc, address }
        })
        return res.json(clients)
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
        Client.updateOne({ _id: req.params.id }, {
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

    //-----------
    Client.findById(req.params.id, (err, client) => {
        //if no account found
        if (err || !client) return res.status(400).json({ err: requireMessages(req.body.lang).noAccountFound });
        if (client.email == req.body.email) return res.status(400).json({ err: "You are already using this email!" })

        //else
        client.newEmail = req.body.email;
        client.newEmailConfirmation = code;
        client.newEmailConfirmationExpiration = Date.now() + 180000;
        client.save()
        sendConfirmationMail(req.body.email, code, req.body.lang);
        return res.json({ msg: "confirmation code sent to email!" })
    });
}

//confirm the new email
exports.confirmNewEmail = (req, res) => {
    Client.findOne({ _id: req.params.id, newEmailConfirmationExpiration: { $gt: Date.now() } })
        .then(client => {
            if (!client) return res.status(400).json({ msg: "This code have been expired, you can request a new one!" });
            if (client.newEmailConfirmation != req.body.code) return res.status(400).json({ err: "Confirmation code is not correct!" });
            ///////////////////////////////////////////
            let newMail = client.newEmail,
                oldMail = client.email;
            ///////////////////////////////////////////
            client.email = client.newEmail;
            client.newEmail = undefined;
            client.newEmailConfirmation = undefined;
            client.newEmailConfirmationExpiration = undefined;
            client.save().then(result => {
                //adding new email to used emails
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
    Client.findById(req.params.id, (err, client) => {
        if (err || !client) return res.status(400).json({ msg: requireMessages(req.body.lang).noAccountFound });

        //if an account found
        var code = generateConfirmationCode();

        if (req.body.type == "new-email") {
            if (client.newEmail) {
                //if 60 seconds doesn't pass yet
                if (Date.parse(client.newEmailConfirmationExpiration) - 120000 > (Date.now()))
                    return res.status(400).json({ err: "you have to wait 60 seconds!" });
                //else
                client.newEmailConfirmation = code;
                client.newEmailConfirmationExpiration = Date.now() + 180000;
                client.save();
                sendConfirmationMail(client.newEmail, code, req.body.lang);
            } else return res.status(400).json({ err: "want to resend code, but no newEmail found!" });
        } else {
            client.confirmation_code = code;
            client.save();
            sendConfirmationMail(client.email, code, req.body.lang);
        }
        return res.json({ msg: requireMessages(req.body.lang).emailSent })
    })
}

//set client Inactive
// exports.deactivateClient = (req, res) => {
//     console.table(req.body)
//     Client.updateOne({ _id: req.body.client_id }, { $set: { status: { active: false } } },
//         (err, result) => {
//             if (err || !result) return res.status(400).json({ err: "cannot find this user" })
//             return res.json({ response: "Client deativated!" })
//         })
// }

// //set client active
// exports.activateClient = (req, res) => {
//     console.log(req.body)
//     Client.updateOne({ _id: req.body.client_id }, { $set: { status: { active: true } } },
//         (err, result) => {
//             if (err || !result) return res.status(400).json({ err: "cannot find this user" })
//             return res.json({ response: "Client ativated!" })
//         })
// }

//delete client account
exports.deleteClient = (req, res) => {

    Client.findById(req.params.id, (err, user) => {
        if (err || !user)
            return res.status(400).json({ err: "user not found!!" });

        //insert into deleted clients
        const deleted = new DeletedClient({...user })
        deleted.save((err, result) => {
            if (err) {
                console.log(err)
            } else console.log("client account deleted!")
        })

        //delete from clients table
        Client.findByIdAndDelete(req.params.id).then((response, err) => {
            if (err) return res.status(400).json({ err: err });
            res.json({ msg: "client accouts deleted" });

            //delete email from used emails
            UsedEmail.deleteOne({ email: user.email })
        });


    });
}