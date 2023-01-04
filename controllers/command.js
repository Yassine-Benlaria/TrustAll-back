const Command = require("../models/command"),
    AuthAgent = require("../models/auth-agent");
const Plan = require("../models/plan");
const mongoose = require("mongoose");
const { getCommuneByID } = require("../validators/cities");

//add new command
exports.addCommand = async(req, res) => {

    let plan;
    //check if plan exists
    try {
        plan = await Plan.findById(req.body.plan_id);
    } catch (err) {
        console.table({ plan_error: err })
        return res.status(400).json({ err: "Could not find the plan!" })
    }
    //if plan doesn't exist
    if (!plan) return res.status(400).json({ err: "Could not find the plan!" });

    //finding authagents of seller's wilaya
    let auth_agent_seller;
    try {
        auth_agent_seller = await AuthAgent.findOne({
            city: getCommuneByID(req.body.commune_id).wilaya_code,
            communes: req.body.commune_id
        }, { _id: true, communes: true });
    } catch (err) {
        console.table({ authagents_error: err })
        return res.status(400).json({ err: "Could not find seller's authagents!" })
    }
    console.table({ auth_agent_seller });
    //if auth_agent_seller does not exist
    if (!auth_agent_seller) return res.status(400).json({ err: "Service is not available in this region!" });

    //finding authagents of client's wilaya
    let auth_agent_client;
    try {
        auth_agent_client = await AuthAgent.findOne({
            city: getCommuneByID(+req.profile.commune_id).wilaya_code,
            communes: +req.profile.commune_id
        }, { _id: true, communes: true });
    } catch (err) {
        console.table({ authagents_error: err })
        return res.status(400).json({ err: "Could not find client's authagents!" })
    }
    //if auth_agent_client does not exist
    if (!auth_agent_client) return res.status(400).json({ err: "Service is not available in your city!" });



    let json = {...req.body,
        client_id: req.params.id,
        auth_agent_client: auth_agent_client._doc._id,
        auth_agent_seller: auth_agent_seller._doc._id
    }
    console.table(json)
    let command = new Command(json)
    command.save((err, createdCommand) => {
        if (err || !createdCommand) {
            console.log(err)
            return res.status(400).json({ err: "Error occured while creating command!" });
        }
        return res.json({ msg: "Created successfully!!!" });
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
    // console.log(req.params)
    Command.aggregate([
        { $project: { _id: 1, createdAt: 1, plan_id: 1, client_id: 1 } },
        {
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