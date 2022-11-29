const Command = require("../models/command")

//add new command
exports.addCommand = (req, res) => {
    const command = new Command(req.body)
    command.save((err, createdCommand) => {
        if (err || !createdCommand)
            return res.status(400).json({ err: "cannot create command" });
        return res.json({ createdCommand });
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