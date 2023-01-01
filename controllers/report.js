const Command = require("../models/command"),
    Report = require("../models/report"),
    Plan = require("../models/plan")
const { uploadFilesToImageKit } = require("../helpers/imageUploader");
const { imagesUpload } = require("../helpers/uploader");

exports.uploadImages = (req, res) => {


    imagesUpload(req, res, (err) => {
        if (err) return res.status(400).json({ err })

        // console.log(req.files)
        console.table(req.body)
        uploadFilesToImageKit(req.files)
        return res.send("images uploaded successfully")
    });

}

exports.createReport = (req, res) => {
    console.log("req:---", req)
    Command.findById(req.body.command_id, (err, command) => {
        //if command not found
        if (err || !command) return res.status(400).json({ err: "Command not found!" })

        //if command found
        Plan.findById(command.plan_id, (err, plan) => {
            if (err || !plan) return res.status(400).json({ err: "Plan not found!" })
            let report_json = {
                created_by: req.params.id,
                command_id: req.body.command_id,
                car_information: {},
                interior: {},
                exterior: {},
                mechanical: {}
            };
            //car information
            plan.car_information.forEach(element => {
                report_json.car_information[element] = req.body.car_information[element]
            });

            //interior
            plan.interior.forEach(element => {
                report_json.interior[element] = {
                    description: req.body.interior[element],
                    status: req.body["interior_check"][element] == "on" ? true : false
                }

            });

            //exterior
            plan.exterior.forEach(element => {
                report_json.exterior[element] = {
                    description: req.body.exterior[element],
                    status: req.body["exterior_check"][element] == "on" ? true : false
                }
            });

            //mechanical
            plan.mechanical.forEach(element => {
                report_json.mechanical[element] = {
                    description: req.body.mechanical[element],
                    status: req.body["mechanical_check"][element] == "on" ? true : false
                }
            });

            console.log("report_json", report_json);

            report = new Report(report_json)
            report.save()
            res.json({ msg: "normalement everything is ok" })

        })
    });
}