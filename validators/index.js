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
    req.check("password").isLength({ min: 8, max: 100 }).withMessage(msg)

    //returning error
    const errors = req.validationErrors();
    if (errors) {
        let errList = [];
        errors.map(error => errList.push(error.msg));
        return res.status(400).json({ err: errList })
    }
    next()
}

exports.createBlogValidator = async(req, res, next) => {
    const messages = requireMessages(req.body.lang)

    //check title
    req.check("title").trim().notEmpty().withMessage(messages.title)

    //check content
    req.check("content").trim().notEmpty().withMessage(messages.content)

    //returning error
    const errors = req.validationErrors();
    // if (errors) {
    //     const firstError = errors.map(error => error.msg)[0];
    //     return res.status(400).json({ err: firstError })
    // }
    if (errors) {
        let errList = [];
        errors.map(error => errList.push(error.msg));
        return res.status(400).json({ err: [...new Set(errList)] })
    }
    next()
}

exports.addCommandValidator = async(req, res, next) => {
    const messages = requireMessages(req.body.lang)

    //check car name
    req.check("car_name").trim().notEmpty().withMessage(messages.carName)

    //check address
    req.check("commune_id").isIn(getAllCommunes().map(o => o.id)).withMessage(messages.commune)

    //check phone number
    req.check("seller_phone", messages.phone).isMobilePhone().isLength({ min: 10, max: 10 });

    //returning error
    const errors = req.validationErrors();
    // if (errors) {
    //     const firstError = errors.map(error => error.msg)[0];
    //     return res.status(400).json({ err: firstError })
    // }
    if (errors) {
        let errList = [];
        errors.map(error => errList.push(error.msg));
        return res.status(400).json({ err: [...new Set(errList)] })
    }
    next()
}

exports.createAuthAgentValidator = async(req, res, next) => {
    const messages = requireMessages(req.body.lang)
    console.table(req.body)

    //checking first name
    req.check("first_name").trim().matches(regName).withMessage(messages.firstName);

    //checking last name
    req.check("last_name").trim().matches(regName).withMessage(messages.lastName);

    //checking email
    req.check("email").isEmail().withMessage(messages.email)

    //checking phone
    req.check("phone").isMobilePhone().isLength({ min: 10, max: 10 }).withMessage(messages.phone)

    //checkingcity
    console.log(range(1, 58, 1).map(number => { return String(number).padStart(2, "0") }))
    req.check("city").isIn(range(1, 59, 1).map(number => { return String(number).padStart(2, "0") })).withMessage(messages.city)

    //checking birth date
    if (req.body.birth_date)
        req.check("birth_date").isISO8601().withMessage(messages.date)

    //returning error
    const errors = req.validationErrors();
    // if (errors) {
    //     const firstError = errors.map(error => error.msg)[0];
    //     return res.status(400).json({ err: firstError })
    // }
    if (errors) {
        let errList = [];
        errors.map(error => errList.push(error.msg));
        return res.status(400).json({ err: [...new Set(errList)] })
    }
    next()
}

const range = (start, stop, step) =>
    Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);