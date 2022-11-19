const edc = require("email-domain-check");
const { requireMessages } = require("../helpers");
const { getAllCommunes } = require("./cities");
const regName = /((^[a-zA-Z]{2,15}( [a-zA-Z]{2,15})*$)|(^[\u0600-\u06FF]{2,15}( [\u0600-\u06FF]{2,15})*$))/;

exports.validator = async(req, res, next) => {

    const msg = requireMessages(req.body.lang)

    //checking first name
    req.check("first_name").trim().matches(regName).withMessage(msg.firstName);

    //checking last name
    req.check("last_name").trim().matches(regName).withMessage(msg.lastName);

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
exports.clientUpdateValidator = async(req, res, next) => {

    const msg = requireMessages(req.body.lang)

    //checking first name
    if (req.body.first_name != undefined) req.check("first_name").trim().matches(regName).withMessage(msg.firstName);

    //checking last name
    if (req.body.last_name != undefined) req.check("last_name").trim().matches(regName).withMessage(msg.lastName);

    //checking birth date
    if (req.body.birth_date)
        req.check("birth_date").isISO8601().withMessage(msg.date)

    //checkingcity
    if (req.body.commune_id) req.check("commune_id").isIn(getAllCommunes().map(o => o.id)).withMessage(msg.commune)

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