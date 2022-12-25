const Command = require("../models/command")
const Plan = require("../models/plan")
const mongoose = require("mongoose")

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
    Command.aggregate([{
            $lookup: {
                from: 'plans',
                localField: 'plan_id',
                foreignField: '_id',
                as: 'plan'
            }
        },
        {
            $set: {
                plan: { $arrayElemAt: ["$plan.title", 0] }
            }
        }
    ], (err, result) => {
        if (err || !result) {
            return res.status(400).json(err)
        }
        return res.json(result)
    })
}

//get commands by client ID
exports.getCommandsByClientID = (req, res) => {
    console.log(req.params)
    Command.aggregate([{
            $lookup: {
                from: 'plans',
                localField: 'plan_id',
                foreignField: '_id',
                as: 'plan'
            }
        },
        {
            $set: {
                plan: { $arrayElemAt: ["$plan.title", 0] }
            }
        },
        { $match: { client_id: mongoose.Types.ObjectId(req.params.id) } }
        // {
        //     client_id: req.params.id
        // }
    ], (err, result) => {
        if (err || !result) {
            return res.status(400).json(err)
        }
        return res.json(result)
    })
}