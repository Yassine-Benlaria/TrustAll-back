const Command = require("../models/command"),
    AuthAgent = require("../models/auth-agent"),
    Notification = require("../models/notification"),
    Plan = require("../models/plan"),
    Agent = require("../models/agent");
const mongoose = require("mongoose");
const { getCommuneByID } = require("../validators/cities");
const axios = require('axios')
require("dotenv").config();

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
            communes: +req.body.commune_id
        }, { _id: true, communes: true, notifications: true });
    } catch (err) {
        console.table({ authagents_error: err })
        return res.status(400).json({ err: "Could not find seller's authagents!" })
    }

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
    });

    //notifications
    let notification = new Notification({
        subject: "New Command!",
        description: `${req.profile.first_name} ${req.profile.last_name} have placed a new command, go check it to confirm or decline.`
    });


    AuthAgent.updateOne({ _id: auth_agent_seller._id }, { $push: { notifications: notification } })
        .then(result => console.log("done"))
        .catch(err => console.log(err));

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

//get car commands by auth_agent ID
exports.getCarCommandsByAuthAgent = (req, res) => {
    Command.aggregate([{
            $project: {
                status: 1,
                _id: 1,
                payed: 1,
                car_name: 1,
                seller_name: 1,
                seller_phone: 1,
                createdAt: 1,
                plan_id: 1,
                client_id: 1,
                auth_agent_client: 1,
                auth_agent_seller: 1,
                agent_client: 1,
                agent_seller: 1
            }
        },
        // getting full name of seller-side agent
        {
            $lookup: {
                from: 'agents',
                localField: 'agent_seller',
                foreignField: '_id',
                as: 'agent_seller'
            }
        }, {
            $set: {
                agent_seller: {
                    $concat: [{ $arrayElemAt: ["$agent_seller.first_name", 0] },
                        " ",
                        { $arrayElemAt: ["$agent_seller.last_name", 0] }
                    ]
                }
                // agent_client: { $arrayElemAt: ["$agent_client.first_name", 0] }
            }
        },

        // getting full name and phone number of client
        {
            $lookup: {
                from: 'clients',
                localField: 'client_id',
                foreignField: '_id',
                as: 'client'
            }
        }, {
            $set: {
                client_name: {
                    $concat: [{ $arrayElemAt: ["$client.first_name", 0] },
                        " ",
                        { $arrayElemAt: ["$client.last_name", 0] }
                    ]
                },
                client_phone: {
                    $arrayElemAt: ["$client.phone", 0]
                },
                client: undefined
            },
        },
        //
        { $match: { auth_agent_seller: mongoose.Types.ObjectId(req.params.id) } }
        // {
        //     client_id: req.params.id
        // }
    ], (err, result) => {
        if (err || !result) {
            console.log(err);
            return res.json({ msg: [] })
        }
        return res.json(result)
    })

    // Command.find({ $or: [{ auth_agent_client: req.params.id }, { auth_agent_seller: req.params.id }] }, (err, result) => {
    //     if (err || !result) { return res.json({ msg: [] }) }
    //     return res.json(result)
    // })
}

//get money commands by auth_agent ID
exports.getMoneyCommandsByAuthAgent = (req, res) => {
    Command.aggregate(
        [{
                $project: {
                    status: 1,
                    payed: 1,
                    _id: 1,
                    seller_name: 1,
                    seller_phone: 1,
                    createdAt: 1,
                    plan_id: 1,
                    client_id: 1,
                    car_name: 1,
                    auth_agent_client: 1,
                    auth_agent_seller: 1,
                    agent_client: 1,
                    agent_seller: 1
                }
            },
            // getting ful name of client-side agent
            {
                $lookup: {
                    from: 'agents',
                    localField: 'agent_client',
                    foreignField: '_id',
                    as: 'agent_client'
                }
            }, {
                $set: {
                    agent_client: {
                        $concat: [{ $arrayElemAt: ["$agent_client.first_name", 0] },
                            " ",
                            { $arrayElemAt: ["$agent_client.last_name", 0] }
                        ]
                    }
                    // agent_client: { $arrayElemAt: ["$agent_client.first_name", 0] }
                }
            },


            // getting full name and phone number of client
            {
                $lookup: {
                    from: 'clients',
                    localField: 'client_id',
                    foreignField: '_id',
                    as: 'client'
                }
            }, {
                $set: {
                    client_name: {
                        $concat: [{ $arrayElemAt: ["$client.first_name", 0] },
                            " ",
                            { $arrayElemAt: ["$client.last_name", 0] }
                        ]
                    },
                    client_phone: {
                        $arrayElemAt: ["$client.phone", 0]
                    },
                    client: undefined
                },
            },

            // getting price of the plan
            {
                $lookup: {
                    from: 'plans',
                    localField: 'plan_id',
                    foreignField: '_id',
                    as: 'price'
                }
            }, {
                $set: {
                    price: { $arrayElemAt: ["$price.price", 0] }

                }
            },
            //
            { $match: { auth_agent_client: mongoose.Types.ObjectId(req.params.id) } }
            // {
            //     client_id: req.params.id
            // }
        ], (err, result) => {
            if (err || !result) {
                console.log(err);
                return res.json({ msg: [] })
            }
            return res.json(result)
        })

    // Command.find({ $or: [{ auth_agent_client: req.params.id }, { auth_agent_seller: req.params.id }] }, (err, result) => {
    //     if (err || !result) { return res.json({ msg: [] }) }
    //     return res.json(result)
    // })
}

//get car commands by agent ID
exports.getCarCommandsByAgent = (req, res) => {
    Command.aggregate([{
            $project: {
                status: 1,
                _id: 1,
                payed: 1,
                car_name: 1,
                seller_name: 1,
                seller_phone: 1,
                createdAt: 1,
                plan_id: 1,
                client_id: 1,
                auth_agent_seller: 1,
                agent_seller: 1
            }
        },
        // getting full name and phone number of client
        {
            $lookup: {
                from: 'clients',
                localField: 'client_id',
                foreignField: '_id',
                as: 'client'
            }
        }, {
            $set: {
                client_name: {
                    $concat: [{ $arrayElemAt: ["$client.first_name", 0] },
                        " ",
                        { $arrayElemAt: ["$client.last_name", 0] }
                    ]
                },
                client_phone: {
                    $arrayElemAt: ["$client.phone", 0]
                },
                client: undefined
            },
        },
        //
        { $match: { agent_seller: mongoose.Types.ObjectId(req.params.id), status: { $in: ["06", "07", "08"] } } }
        // {
        //     client_id: req.params.id
        // }
    ], (err, result) => {
        if (err || !result) {
            console.log(err);
            return res.json({ msg: [] })
        }
        return res.json(result)
    })

    // Command.find({ $or: [{ auth_agent_client: req.params.id }, { auth_agent_seller: req.params.id }] }, (err, result) => {
    //     if (err || !result) { return res.json({ msg: [] }) }
    //     return res.json(result)
    // })
}

//get money commands by auth_agent ID
exports.getMoneyCommandsByAgent = (req, res) => {
    Command.aggregate(
        [{
                $project: {
                    status: 1,
                    payed: 1,
                    _id: 1,
                    seller_name: 1,
                    seller_phone: 1,
                    createdAt: 1,
                    plan_id: 1,
                    client_id: 1,
                    car_name: 1,
                    agent_client: 1,
                }
            },

            // getting full name and phone number of client
            {
                $lookup: {
                    from: 'clients',
                    localField: 'client_id',
                    foreignField: '_id',
                    as: 'client'
                }
            }, {
                $set: {
                    client_name: {
                        $concat: [{ $arrayElemAt: ["$client.first_name", 0] },
                            " ",
                            { $arrayElemAt: ["$client.last_name", 0] }
                        ]
                    },
                    client_phone: {
                        $arrayElemAt: ["$client.phone", 0]
                    },
                    client: undefined
                },
            },

            // getting price of the plan
            {
                $lookup: {
                    from: 'plans',
                    localField: 'plan_id',
                    foreignField: '_id',
                    as: 'price'
                }
            }, {
                $set: {
                    price: { $arrayElemAt: ["$price.price", 0] }

                }
            },
            //
            { $match: { agent_client: mongoose.Types.ObjectId(req.params.id), status: { $in: ["04", "05", "06", "07", "08"] } } }
            // {
            //     client_id: req.params.id
            // }
        ], (err, result) => {
            if (err || !result) {
                console.log(err);
                return res.json({ msg: [] })
            }
            return res.json(result)
        })

    // Command.find({ $or: [{ auth_agent_client: req.params.id }, { auth_agent_seller: req.params.id }] }, (err, result) => {
    //     if (err || !result) { return res.json({ msg: [] }) }
    //     return res.json(result)
    // })
}

//get commands by client ID
exports.getCommandsByClientID = (req, res) => {
    // console.log(req.params)
    Command.aggregate([
        { $project: { _id: 1, createdAt: 1, plan_id: 1, client_id: 1, car_name: 1, commune_id: 1 } },
        {
            $lookup: {
                from: 'plans',
                localField: 'plan_id',
                foreignField: '_id',
                as: 'plan'
            }
        }, {
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

        let response = result.map(command => {
            return {...command, city: req.query.lang == "ar" ? getCommuneByID(command.commune_id).wilaya_name : getCommuneByID(command.commune_id).wilaya_name_ascii }
        })
        return res.json(response)
    })
}

//get command by id (by client)
exports.getClientCommandByID = (req, res) => {

    Command.findById(req.query.command_id, (err, command) => {
        if (err || !command || command.client_id != req.params.id) return res.status(400).json({ err: "command not found!" });

        return res.json(command)
    })
}

//confirm command by auth-agent
exports.confirmCommandByAuthAgent = (req, res) => {
    Command.findOne({ _id: req.body.command_id }).then(command => {
        if (command.auth_agent_seller != req.params.id && req.profile.type != "admin")
            return res.status(400).json({ err: "You are not authorized to confirm this command" });
        if (command.status == "01") {
            if (req.body.action == "yes") {
                command.status = "02";
                command.save();
                return res.json({ msg: "command confirmed" })
            } else if (req.body.action == "no") {
                //delete from database
                Command.findByIdAndDelete(command._id, (err, result) => {
                    if (err || !result) console.log(err)
                })
                return res.json({ msg: "command declined" })
            }
        } else if (command.status == "02") {
            if (req.body.action == "yes") {
                command.status = "03";
                command.save();
                res.json({ msg: "command confirmed" })

                //notifications
                let notification = new Notification({
                    subject: "New mission!",
                    description: `You have a new mission to complete the payment of command n: ${command._id}, go check it!`
                });

                return AuthAgent.updateOne({ _id: req.body.auth_agent_client }, { $push: { notifications: notification } })
                    .then(result => console.log("done"))
                    .catch(err => console.log(err));
            } else if (req.body.action == "no") {
                //delete from database
                Command.findByIdAndDelete(command._id, (err, result) => {
                    if (err || !result) console.log(err)
                })
                return res.json({ msg: "command declined" })
            }
        }
    }).catch(err => {
        console.log(err);
        return res.status(400).json({ err: "error occured" })
    })
}

//assign seller-side agent
exports.assignSellerAgent = (req, res) => {
    Command.findOne({ _id: req.body.command_id }).then(command => {
        if (command.status != "05")
            return res.status(400).json({ err: "this task can't be done at this step!" });

        if (command.auth_agent_seller != req.params.id)
            return res.status(400).json({ err: "You are not authorized to do this task" });
        command.agent_seller = req.body.agent_id;
        command.status = "06"
        command.save()
        res.json({ msg: "agent assigned" })

        //notifications
        let notification = new Notification({
            subject: "New mission!",
            description: `You have a new mission to verify a car and fill a report, go check it!`
        });

        Agent.updateOne({ _id: req.body.agent_id }, { $push: { notifications: notification } })
            .then(result => console.log("done"))
            .catch(err => console.log(err));
    }).catch(err => {
        console.log(err);
        return res.status(400).json({ err: "error occured" })
    })
}

//assign client-side agent
exports.assignClientAgent = (req, res) => {
    Command.findOne({ _id: req.body.command_id }).then(command => {
        if (command.status != "03")
            return res.status(400).json({ err: "this task can't be done at this step!" });
        if (command.auth_agent_client != req.params.id)
            return res.status(400).json({ err: "You are not authorized to do this task" });
        command.agent_client = req.body.agent_id;
        command.status = "04"
        command.save()
        res.json({ msg: "agent assigned" })

        //notifications
        let notification = new Notification({
            subject: "New mission!",
            description: `You have a new mission to complete the payment of a command, go check it!`
        });

        Agent.updateOne({ _id: req.body.agent_id }, { $push: { notifications: notification } })
            .then(result => console.log("done"))
            .catch(err => console.log(err));
    }).catch(err => {
        console.log(err);
        return res.status(400).json({ err: "error occured" })
    })
}

//confirm payment by auth-agent
exports.confirmPaymentByAuthAgent = (req, res) => {
    Command.findOne({ _id: req.body.command_id }).then(command => {
        if (command.status != "04")
            return res.status(400).json({ err: "this task can't be done at this step!" });
        if (command.auth_agent_client != req.params.id)
            return res.status(400).json({ err: "You are not authorized to do this task" });
        command.payed.auth_agent = true;
        command.payed.type = "hand";
        command.status = "05"
        command.save()
        res.json({ msg: "payment confirmed by authagent" })

        //notifications
        let notification = new Notification({
            subject: "Payment confirmed!",
            description: `The payment of the comand ${req.body.command_id} has been confirmed by the auth-agent!`
        });

        Agent.updateOne({ _id: command.agent_client }, { $push: { notifications: notification } })
            .then(result => console.log("done"))
            .catch(err => console.log(err));

        //notifications
        let notification1 = new Notification({
            subject: "Payment completed!",
            description: `The payment of the comand ${req.body.command_id} has been completed, you can start the process of verification!`
        });

        AuthAgent.updateOne({ _id: command.auth_agent_seller }, { $push: { notifications: notification1 } })
            .then(result => console.log("done"))
            .catch(err => console.log(err));
    }).catch(err => {
        console.log(err);
        return res.status(400).json({ err: "error occured" })
    })
}

//confirm payment by agent
exports.confirmPaymentByAgent = (req, res) => {
    Command.findOne({ _id: req.body.command_id }).then(command => {
        if (command.status != "04")
            return res.status(400).json({ err: "this task can't be done at this step!" });
        if (command.agent_client != req.params.id)
            return res.status(400).json({ err: "You are not authorized to do this task" });
        command.payed.agent = true;
        command.save()
        res.json({ msg: "payment confirmed by agent" })

        //notifications
        let notification = new Notification({
            subject: "Payment done!",
            description: `The payment of the command ${command._id} has been completed by the agent!`
        });

        return AuthAgent.updateOne({ _id: command.auth_agent_client }, { $push: { notifications: notification } })
            .then(result => console.log("done"))
            .catch(err => console.log(err));

    }).catch(err => {
        console.log(err);
        return res.status(400).json({ err: "error occured" })
    })
}

//confirm payment by client
exports.confirmPaymentByClient = (req, res) => {
    Command.findOne({ _id: req.body.command_id }).then(command => {
        if (command.status != "04")
            return res.status(400).json({ err: "this task can't be done at this step!" });
        if (command.client_id != req.params.id)
            return res.status(400).json({ err: "You are not authorized to do this task" });
        command.payed.client = true;
        command.save()
        return res.json({ msg: "payment confirmed by client" })
    }).catch(err => {
        console.log(err);
        return res.status(400).json({ err: "error occured" })
    })
}

//get car commands by admin
exports.getCarCommandsByAdmin = (req, res) => {

    console.log(req.profile)
    if (req.profile.type != "admin") return res.status(400).json({ err: "not authorized" })

    Command.aggregate([{
            $project: {
                status: 1,
                _id: 1,
                payed: 1,
                car_name: 1,
                seller_name: 1,
                seller_phone: 1,
                createdAt: 1,
                plan_id: 1,
                client_id: 1,
                auth_agent_client: 1,
                auth_agent_seller: 1,
                agent_client: 1,
                agent_seller: 1
            }
        },
        // getting full name of seller-side agent
        {
            $lookup: {
                from: 'agents',
                localField: 'agent_seller',
                foreignField: '_id',
                as: 'agent_seller'
            }
        }, {
            $set: {
                agent_seller: {
                    $concat: [{ $arrayElemAt: ["$agent_seller.first_name", 0] },
                        " ",
                        { $arrayElemAt: ["$agent_seller.last_name", 0] }
                    ]
                }
                // agent_client: { $arrayElemAt: ["$agent_client.first_name", 0] }
            }
        },

        // getting full name of seller-side auth agent
        {
            $lookup: {
                from: 'authagents',
                localField: 'auth_agent_seller',
                foreignField: '_id',
                as: 'auth_agent_seller'
            }
        }, {
            $set: {
                auth_agent_seller: {
                    $concat: [{ $arrayElemAt: ["$auth_agent_seller.first_name", 0] },
                        " ",
                        { $arrayElemAt: ["$auth_agent_seller.last_name", 0] }
                    ]
                }
            }
        },


        // getting full name and phone number of client
        {
            $lookup: {
                from: 'clients',
                localField: 'client_id',
                foreignField: '_id',
                as: 'client'
            }
        }, {
            $set: {
                client_name: {
                    $concat: [{ $arrayElemAt: ["$client.first_name", 0] },
                        " ",
                        { $arrayElemAt: ["$client.last_name", 0] }
                    ]
                },
                client_phone: {
                    $arrayElemAt: ["$client.phone", 0]
                },
                client: undefined
            },
        },
    ], (err, result) => {
        if (err || !result) {
            console.log(err);
            return res.json({ msg: [] })
        }
        return res.json(result)
    })

    // Command.find({ $or: [{ auth_agent_client: req.params.id }, { auth_agent_seller: req.params.id }] }, (err, result) => {
    //     if (err || !result) { return res.json({ msg: [] }) }
    //     return res.json(result)
    // })
}

//get money commands by admin
exports.getMoneyCommandsByAdmin = (req, res) => {
    if (req.profile.type != "admin") return res.status(400).json({ err: "not authorized" })

    Command.aggregate(
        [{
                $project: {
                    status: 1,
                    payed: 1,
                    _id: 1,
                    seller_name: 1,
                    seller_phone: 1,
                    createdAt: 1,
                    plan_id: 1,
                    client_id: 1,
                    car_name: 1,
                    auth_agent_client: 1,
                    auth_agent_seller: 1,
                    agent_client: 1,
                    agent_seller: 1
                }
            },
            // getting ful name of client-side agent
            {
                $lookup: {
                    from: 'agents',
                    localField: 'agent_client',
                    foreignField: '_id',
                    as: 'agent_client'
                }
            }, {
                $set: {
                    agent_client: {
                        $concat: [{ $arrayElemAt: ["$agent_client.first_name", 0] },
                            " ",
                            { $arrayElemAt: ["$agent_client.last_name", 0] }
                        ]
                    }
                    // agent_client: { $arrayElemAt: ["$agent_client.first_name", 0] }
                }
            },

            // getting ful name of client-side authagent
            {
                $lookup: {
                    from: 'authagents',
                    localField: 'auth_agent_client',
                    foreignField: '_id',
                    as: 'auth_agent_client'
                }
            }, {
                $set: {
                    auth_agent_client: {
                        $concat: [{ $arrayElemAt: ["$auth_agent_client.first_name", 0] },
                            " ",
                            { $arrayElemAt: ["$auth_agent_client.last_name", 0] }
                        ]
                    }
                }
            },


            // getting full name and phone number of client
            {
                $lookup: {
                    from: 'clients',
                    localField: 'client_id',
                    foreignField: '_id',
                    as: 'client'
                }
            }, {
                $set: {
                    client_name: {
                        $concat: [{ $arrayElemAt: ["$client.first_name", 0] },
                            " ",
                            { $arrayElemAt: ["$client.last_name", 0] }
                        ]
                    },
                    client_phone: {
                        $arrayElemAt: ["$client.phone", 0]
                    },
                    client: undefined
                },
            },

            // getting price of the plan
            {
                $lookup: {
                    from: 'plans',
                    localField: 'plan_id',
                    foreignField: '_id',
                    as: 'price'
                }
            }, {
                $set: {
                    price: { $arrayElemAt: ["$price.price", 0] }

                }
            },
            //
            // {
            //     client_id: req.params.id
            // }
        ], (err, result) => {
            if (err || !result) {
                console.log(err);
                return res.json({ msg: [] })
            }
            return res.json(result)
        })

    // Command.find({ $or: [{ auth_agent_client: req.params.id }, { auth_agent_seller: req.params.id }] }, (err, result) => {
    //     if (err || !result) { return res.json({ msg: [] }) }
    //     return res.json(result)
    // })
}

//client epay
exports.clientE_Payment = async(req, res) => {

    let plan = await Command.aggregate([{
            $project: {
                plan_id: 1,
                _id: 1
            }
        }, {
            $lookup: {
                from: "plans",
                localField: "plan_id",
                foreignField: "_id",
                as: "price"
            }
        },
        {
            $set: { price: { $arrayElemAt: ["$price.price_baridi_mob", 0] } }
        },
        {
            $match: { _id: mongoose.Types.ObjectId(req.body.command_id) }
        }
    ]);

    axios
        .post(process.env.PYTHON_SERVER, {
            API_KEY: process.env.CHARGILY_APP_KEY,
            client: req.profile.first_name + " " + req.profile.last_name,
            email: req.profile.email,
            invoice_number: req.body.command_id,
            mode: req.body.mode,
            amount: parseFloat(plan[0].price),
            discount: 0,
            comment: `paying for command N: ${req.body.command_id}`,
            back_url: `https://trust-all.vercel.app/client/commands/request-status/${req.body.command_id}`,
            webhook_url: "https://iffhass-back.vercel.app/api/test"
        })
        .then(response => {
            console.log(`statusCode: ${response.statusCode}`)
            console.log(response.data)
            res.send({ msg: response.data.checkout_url })
        })
        .catch(error => {
            console.error(error)
            res.status(400).json({ err: "error occured when requesting payment" })
        })
}