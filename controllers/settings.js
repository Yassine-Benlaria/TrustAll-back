const Settings = require("../models/settings");

//create
exports.createSettings = async(req, res) => {
    let nbr = await Settings.find().count();
    if (nbr > 0) return res.status(400).json({ err: "settings have been already created before!" });

    let settings = new Settings(req.body);
    settings.save().then(result => { return res.json({ msg: "settings created successfully!" }) }).catch(err => {
        console.log(err);
        return res.status(400).json({ err: "settings have been already created before!" })
    });
}

//update settings
exports.updateSettings = (req, res) => {
    Settings.updateOne({}, req.body, (err, result) => {
        if (err || !result) {
            console.log(err);
            return res.status(400).json({ err: "err while updating settings!" });
        }
        return res.json({ msg: "setting has been updated successfully!" });
    })
}

//get settings
exports.getSettings = (req, res) => {
    Settings.findOne({}, (err, result) => {
        if (err || !result) {
            console.log(err);
            return res.status(400).json({ err: "err while getting settings!" });
        }
        return res.json(result);
    })
}