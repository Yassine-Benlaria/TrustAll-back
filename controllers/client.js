const Client = require("../models/client")

const { generateConfirmationCode, sendConfirmationMail, projectObject } = require("../helpers");

exports.signup = (req, res) => {
    //generating confirmation code
    const code = generateConfirmationCode()

    //saving client to database
    let json = req.body
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