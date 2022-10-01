exports.clientSignUpValidator = (req, res, next) => {


    //importing messages file
    if (req.body.lang == "en") msg = require("./messages/en")
    else msg = require("./messages/en")

    //checking first name
    req.check("first_name").isLength({ min: 3, max: 32 }).withMessage(msg.firstName);

    //checking last name
    req.check("last_name").isLength({ min: 3, max: 32 }).withMessage(msg.lastName);

    //checking email
    req.check("email").isEmail().withMessage(msg.email)

    //checking phone
    req.check("phone").isMobilePhone().withMessage(msg.phone)

    //checking birth date
    req.check("birth_date").isISO8601().withMessage(msg.date)

    //checking password
    req.check("password").isLength({ min: 8 }).withMessage(msg.password)


    //checkingcity

    //checiing commune



    //returning error
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ err: firstError })
    }
    next()
}