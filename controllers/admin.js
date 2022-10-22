const Agent = require("../models/agent")
const Admin = require("../models/admin")
const AuthAgent = require("../models/auth-agent")
const { generateRandomPassword, sendConfirmationMail, projectObject } = require("../helpers");
const projection = {
    salt: false,
    hashed_password: false,
    updatedAt: false,
    __v: false,
};

//create an admin
exports.createAdmin = (req, res) => {
    let admin = new Admin(req.body);

    admin.save((err, createdAdmin) => {
        if (err) {
            return res.status(400).json({ err })
        }
        return res.json(projectObject(createdAdmin, {
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
        req.profile = result
        next();
    })
}