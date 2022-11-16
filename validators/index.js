const edc = require("email-domain-check");
const { requireMessages } = require("../helpers");
const { getAllCommunes } = require("./cities");

exports.validator = async(req, res, next) => {

    console.log("body: ", req.body)
    var msg
        //importing messages file
    if (req.body.lang == "en") {
        msg = require("./messages/en")
    } else if (req.body.lang == "fr") {
        msg = require("./messages/fr")
    } else {
        msg = require("./messages/ar")
    }


    //checking first name
    req.check("first_name").isLength({ min: 3, max: 32 }).withMessage(msg.firstName);

    //checking last name
    req.check("last_name").isLength({ min: 3, max: 32 }).withMessage(msg.lastName);

    //checking email
    req.check("email").isEmail().withMessage(msg.email)

    //checking phone
    req.check("phone").isMobilePhone().isLength({ min: 10, max: 10 }).withMessage(msg.phone)

    //checking birth date
    if (req.body.birth_date)
        req.check("birth_date").isISO8601().withMessage(msg.date)

    //checking password
    req.check("password").isLength({ min: 8 }).withMessage(msg.password)

    //checkingcity
    req.check("commune_id").isIn(getAllCommunes().map(o => o.id)).withMessage(msg.commune)

    //returning error
    const errors = req.validationErrors();
    // if (errors) {
    //     const firstError = errors.map(error => error.msg)[0];
    //     return res.status(400).json({ err: firstError })
    // }
    if (errors) {
        let errList = [];
        errors.map(error => errList.push(error.msg));
        return res.status(400).json({ err: errList })
    }
    next()
}

exports.passwordValidator = async(req, res, next) => {

    const msg = requireMessages(req.body.lang).password

    //checking password
    req.check("password").isLength({ min: 8 }).withMessage(msg)

    //returning error
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ err: firstError })
    }
    next()
}