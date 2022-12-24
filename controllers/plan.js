const { requireMessages } = require("../helpers")
const Plan = require("../models/plan")
const { options } = require("../routes/client")


exports.getPlans = (req, res) => {
    let texts = requireMessages(req.params.lang).options
    Plan.find({}, (err, plans) => {
        if (err || !plans) return res.status(400).json({ err: "no plans found" })
        let response = plans.map(plan => {
            console.table({ test: plan.mechanical })
            return {
                _id: plan._id,
                price: plan.price,
                title: plan.title,
                price_baridi_mob: plan.price_baridi_mob,
                decription: plan.description,
                car_information: plan.car_information.map(option => { return texts.car_information[option] }),
                interior: plan.interior.map(option => { return texts.interior[option] }),
                exterior: plan.exterior.map(option => { return texts.exterior[option] }),
                mechanical: plan.mechanical.map(option => { return texts.mechanical[option] }),
            }
        })
        return res.json({ msg: response })
    })
}

//get plans separated by " - " 
exports.getPlansFormatted = (req, res) => {
    let texts = requireMessages(req.params.lang).options
    Plan.find({}, (err, plans) => {
        if (err || !plans) return res.status(400).json({ err: "no plans found" })
        let response = plans.map(plan => {
            console.table({ test: plan.mechanical })
            return {
                _id: plan._id,
                title: plan.title,
                price: plan.price,
                price_baridi_mob: plan.price_baridi_mob,
                decription: plan.description,
                options: [plan.car_information.map(option => { return texts.car_information[option] }).join(" - "),
                    plan.interior.map(option => { return texts.interior[option] }).join(" - "),
                    plan.exterior.map(option => { return texts.exterior[option] }).join(" - "),
                    plan.mechanical.map(option => { return texts.mechanical[option] }).join(" - ")
                ].join(" - ")

            }
        })
        return res.json({ msg: response })
    })
}