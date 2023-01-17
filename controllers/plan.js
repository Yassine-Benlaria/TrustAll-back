const { requireMessages } = require("../helpers")
const Plan = require("../models/plan")


exports.getPlans = (req, res) => {
    let texts = requireMessages(req.params.lang).options
    Plan.find({}, (err, plans) => {
        if (err || !plans) return res.status(400).json({ err: "no plans found" })
        let response = plans.map(plan => {
            // console.table({ test: plan.mechanical })
            return {
                _id: plan._id,
                price: plan.price,
                title: plan.title,
                price_baridi_mob: plan.price_baridi_mob,
                description: plan.description,
                car_information: plan.car_information.map(option => { return texts.car_information[option] }),
                interior: plan.interior.map(option => { return texts.interior[option] }),
                exterior: plan.exterior.map(option => { return texts.exterior[option] }),
                mechanical: plan.mechanical.map(option => { return texts.mechanical[option] }),
            }
        })
        return res.json({ msg: response })
    })
}

exports.planById = (req, res) => {
        let texts = requireMessages(req.params.lang).options
        Plan.findById(req.params.id, (err, plan) => {
            if (err || !plan) return res.status(400).json({ err: "No plan was found!" })

            //formatting response 
            let car_information = plan.car_information || [],
                interior = plan.interior || [],
                exterior = plan.exterior || [],
                mechanical = plan.mechanical || [];
            let car_information_object = {},
                interior_object = {},
                exterior_object = {},
                mechanical_object = {};

            car_information.map(element => { car_information_object[element] = texts.car_information[element] })
            interior.map(element => { interior_object[element] = texts.interior[element] })
            exterior.map(element => { exterior_object[element] = texts.exterior[element] })
            mechanical.map(element => { mechanical_object[element] = texts.mechanical[element] })

            return res.json({ msg: {...plan._doc, car_information: car_information_object, interior: interior_object, exterior: exterior_object, mechanical: mechanical_object } })
        })
    }
    //get plans separated by " - " 
exports.getPlansFormatted = (req, res) => {
    let texts = requireMessages(req.params.lang).options
    Plan.find({}, (err, plans) => {
        if (err || !plans) return res.status(400).json({ err: "no plans found" })
        let response = plans.map(plan => {
            // console.table({ test: plan.mechanical })
            return {
                _id: plan._id,
                title: plan.title,
                price: plan.price,
                price_baridi_mob: plan.price_baridi_mob,
                description: plan.description,
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

exports.getPlanOptions = (req, res) => {

    let options = requireMessages(req.params.lang).options;

    let response = {}
    Object.keys(options).map(key => {
        response[key] = Object.keys(options[key]).map(option => options[key][option])
    })

    res.json(response)
}