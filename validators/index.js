const edc = require("email-domain-check");
const { getAllCommunes } = require("./cities");

exports.validator = async(req, res, next) => {

    console.log("from validator", req.body)
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

    console.log("here", 1)
        //checking last name
    if (req.body.last_name) req.check("last_name").isLength({ min: 3, max: 32 }).withMessage(msg.lastName);

    console.log("here", 2)

    //checking email
    if (req.body.email) {
        req.check("email").isEmail().withMessage(msg.email)

        // await edc(req.body.email).then(result => {
        //     if (!result) return res.status(400).json({ err: msg.emailNotExist })
        // })
    }
    console.log("here", 3)

    //checking phone
    if (req.body.phone) req.check("phone").isMobilePhone().isLength({ min: 10, max: 10 }).withMessage(msg.phone)

    console.log("here")

    //checking birth date
    if (req.body.birth_date) req.check("birth_date").isISO8601().withMessage(msg.date)

    console.log("here")

    //checking password
    if (req.body.password) req.check("password").isLength({ min: 8 }).withMessage(msg.password)

    console.log("here")
        //checkingcity
    if (req.body.commune_id) {
        req.check("commune_id").isIn(getAllCommunes().map(o => o.id)).withMessage(msg.commune)
    }
    console.log("here")

    //returning error
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ err: firstError })
    }
    next()
}