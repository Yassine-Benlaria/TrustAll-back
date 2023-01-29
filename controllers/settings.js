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
    console.log(req.body)

    let json = { social_media: {}, location: {} };
    if (req.body.facebook != "") json.social_media.facebook = req.body.facebook;
    if (req.body.instagram != "") json.social_media.instagram = req.body.instagram;
    if (req.body.twitter != "") json.social_media.twitter = req.body.twitter;
    if (req.body.whatsapp != "") json.social_media.whatsapp = req.body.whatsapp;
    if (req.body.email != "") json.social_media.email = req.body.email;
    if (req.body.terms != "") json.terms = req.body.terms;

    if (req.body.location) {
        if (req.body.location.ar) json.location.ar = req.body.location.ar;
        if (req.body.location.fr) json.location.fr = req.body.location.fr;
        if (req.body.location.en) json.location.en = req.body.location.en;
    }

    if (req.body.faqs) json.FAQs = req.body.faqs;
    if (req.body.Sugg_comp) json.sugg_comp = req.body.Sugg_comp;

    console.log(json);
    Settings.updateOne({}, json, (err, result) => {
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