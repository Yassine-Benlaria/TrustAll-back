const Plan = require("../models/plan")

exports.getPlans = (req, res) => {
    Plan.find({}, (err, plans) => {
        if (err || !plans) return res.status(400).json({ err: "no plans found" })
        return res.json({ msg: plans })
    })
}