const Command = require("../models/command")
const Plan = require("../models/plan")

//add new command
exports.addCommand = (req, res) => {

    let json = {...req.body, client_id: req.params.id }

    Plan.findById(json.plan_id, (err, result) => {
        if (err || !result) {
            return res.status(400).json({ err: "Could not find the plan!" })
        }

        let command = new Command(json)
        command.save((err, createdCommand) => {
            if (err || !createdCommand)
                return res.status(400).json({ err: "Error occured while creating command!" });
            return res.json({ msg: "Created successfully!!!" });
        })
    })
}

//get all commands
exports.getAllCommands = (req, res) => {
    Command.find({}, (err, result) => {
        if (err || !result) {
            return res.status(400).json(err)
        }
        return res.json(result)
    })
}