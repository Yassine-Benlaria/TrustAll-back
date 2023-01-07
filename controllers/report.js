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
    imagesUpload(req, res, (err) => {
        if (err) return res.status(400).json({ err })
        console.table(req.body)
        console.table({ descriptions: req.body.descriptions })
        console.log("files:---", req.files);
        // console.log("req:---", req)
        let json = JSON.parse(req.body.descriptions)
        let error = false
        Command.findById(req.body.command_id, async(err, command) => {


            // return res.send("images uploaded successfully")
            //if command not found
            if (err || !command) return res.status(400).json({ err: "Command not found!" })

            //if command found
            //if user is not authorized to fill the report
            if (req.profile.type != "admin" &&
                req.params.id != command.auth_agent_seller &&
                req.params.id != command.agent_seller) {
                return res.status(400).json({ err: "you are not authorized to complete this task!" })
            }

            //if user is authorized
            Plan.findById(command.plan_id, async(err, plan) => {
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
                await plan.car_information.forEach(element => {
                    if (json.car_information && json.car_information[element])
                        report_json.car_information[element] = json.car_information[element]
                    else {
                        if (!error)
                            res.status(400).json({ err: `${element} field is empty!` })
                        error = true
                    }
                });

                //interior
                await plan.interior.forEach(element => {
                    report_json.interior[element] = {
                        status: json["interior_check"][element] == "on" ? true : false
                    }
                    if (json.interior[element] && json.interior[element].trim() != "") {
                        console.log("---------------------------is not empty", element)
                        report_json.interior[element].description = json.interior[element]
                    } else {
                        if (report_json.interior[element].status == false) {
                            if (!error)
                                res.status(400).
                            json({ err: `"${element}" text field must not be empty when status is not good!` });
                            error = true

                        }
                    }
                });

                //exterior
                await plan.exterior.forEach(element => {
                    report_json.exterior[element] = {
                        status: json["exterior_check"][element] == "on" ? true : false
                    }
                    if (json.exterior[element] && json.exterior[element].trim() != "") {
                        console.log("---------------------------is not empty", element)
                        report_json.exterior[element].description = json.exterior[element]
                    } else {
                        if (report_json.exterior[element].status == false) {
                            if (!error)
                                res.status(400).
                            json({ err: `"${element}" text field must not be empty when status is not good!` })
                            error = true
                        }
                    }
                });

                //mechanical
                await plan.mechanical.forEach(element => {
                    report_json.mechanical[element] = {
                        status: json["mechanical_check"][element] == "on" ? true : false
                    }
                    if (json.mechanical[element] && json.mechanical[element].trim() != "") {
                        console.log("---------------------------is not empty", element)
                        report_json.mechanical[element].description = json.mechanical[element]
                    } else {
                        if (report_json.mechanical[element].status == false) {
                            if (!error)
                                res.status(400).
                            json({ err: `"${element}" text field must not be empty when status is not good!` })
                            error = true
                        }
                    }
                });

                //if an error had been returned to the client
                if (error) return;

                //video url
                report_json.video_url = json.url;

                //uploading files to imagekit
                let urls = await uploadFilesToImageKit(req.files, req.body.command_id);
                await urls.forEach(url => {
                    let [categorie, field] = url[0].split(".")
                    report_json[categorie][field].image_url = url[1]
                })
                console.log("report_json", report_json);


                report = new Report(report_json)
                report.save()
                command.status = "07";
                command.save();
                return res.json({ msg: "normalement everything is ok" })
            });
        })
    });
}

exports.getReport = (req, res) => {
    Command.findById(req.body.command_id, (err, command) => {
        // if command not found
        if (err || !command) return res.status(400).json({ err: "command not found!" });

        // if user is not authorized to view the report
        if (req.profile.type != "admin" &&
            req.params.id != command.auth_agent_seller &&
            req.params.id != command.agent_seller)
            return res.status(400).json({ err: "not authorized" });

        //if user is authorized
        Report.findOne({ command_id: req.body.command_id }, (err, report) => {
            if (err || !report) return res.status(400).json({ err: "report not found" })

            return res.json(report)
        })
    })
}