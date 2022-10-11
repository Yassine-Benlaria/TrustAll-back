const Agent = require("../models/agent")
var nodemailer = require('nodemailer');
const { generateRandomPassword, sendConfirmationMail, projectObject } = require("../helpers");

//creating new agent
exports.createAgent = (req, res) => {
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