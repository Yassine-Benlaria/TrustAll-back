const Blogger = require("../models/blogger");
const { getCitiesList } = require("../validators/cities");

//get agents list
exports.getBloggersList = (req, res) => {

    Blogger.find({}, (err, result) => {
        if (err || !result) {
            return res.status(400).json(err)
        }
        let citiesList = getCitiesList(req.params.lang)
        let bloggers = result.map(user => {
            let city = citiesList.find(e => e.wilaya_code == user.city).wilaya_name
            return {...user._doc, city }
        })
        return res.json(bloggers)
    })
}