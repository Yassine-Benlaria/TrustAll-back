const edc = require("email-domain-check");
const { getCitiesList, getDirasList } = require("./cities");

exports.validator = async(req, res, next) => {
    var msg
        //importing messages file
    if (req.body.lang == "ar") {
        msg = require("./messages/ar")
    } else if (req.body.lang == "fr") {
        msg = require("./messages/fr")
    } else {
        msg = require("./messages/en")
    }


    //checking first name
    if (req.body.first_name) req.check("first_name").isLength({ min: 3, max: 32 }).withMessage(msg.firstName);

    //checking last name
    if (req.body.last_name) req.check("last_name").isLength({ min: 3, max: 32 }).withMessage(msg.lastName);

    //checking email
    if (req.body.email) {
        req.check("email").isEmail().withMessage(msg.email)

        await edc(req.body.email).then(result => {
            if (!result) return res.status(400).json({ err: msg.emailNotExist })
        })
    }
    //checking phone
    if (req.body.phone) req.check("phone").isMobilePhone().isLength({ min: 10, max: 10 }).withMessage(msg.phone)

    //checking birth date
    if (req.body.birth_date) req.check("birth_date").isISO8601().withMessage(msg.date)

    //checking password
    if (req.body.password) req.check("password").isLength({ min: 8 }).withMessage(msg.password)

    //checkingcity
    if (req.body.city) {
        req.check("city").isIn(getCitiesList(req.body.lang)).withMessage(msg.city)

        //checking daira
        let dairas = getDirasList(req.body.city, req.body.lang)
        req.check("daira").isIn(dairas.map((daira) => { return daira.daira_name })).withMessage(msg.daira)

        //checiing commune
        req.check("commune").isIn(dairas.find(daira => {
            return daira.daira_name == req.body.daira
        }).communes).withMessage(msg.commune)
    }

    //returning error
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ err: firstError })
    }
    next()
}