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
    let json = {
        social_media: {
            facebook: req.body.facebook == "" ? req.body.facebook : undefined,
            instagram: req.body.instagram,
            twitter: req.body.twitter,
            email: req.body.email,
            whatsapp: req.body.whatsapp
        },
        terms: req.body.terms,
        location: req.body.location,
        phone: req.body.whatsapp,
        FAQs: req.body.faqs,
        sugg_comp: req.body.Sugg_comp
    }
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