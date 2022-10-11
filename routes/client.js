const express = require("express")
const router = express.Router()
const cors = require("cors")
const { signup, confirmEmail } = require("../controllers/client")
const { clientSignUpValidator } = require("../validators")
router.use(cors())

//signup route
router.post("/signup", clientSignUpValidator, signup)

//email confirmation route
router.post("/confirm/:id", confirmEmail)


module.exports = router;