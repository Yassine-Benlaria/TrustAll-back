const express = require("express")
const router = express.Router()
const cors = require("cors")
const { signup } = require("../controllers/client")
const { clientSignUpValidator } = require("../validators")
router.use(cors())

router.get("/signup", clientSignUpValidator, signup)



module.exports = router;