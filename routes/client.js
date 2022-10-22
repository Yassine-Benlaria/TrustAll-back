const express = require("express")
const router = express.Router()
const cors = require("cors")
const { signup, confirmEmail, clientByID, getClientsList } = require("../controllers/client")
const { clientSignUpValidator } = require("../validators")
router.use(cors())

//signup route
router.post("/signup", clientSignUpValidator, signup)

//email confirmation route
router.post("/confirm/:id", confirmEmail)

//get clients list
router.get("/all", getClientsList)

//get client info
router.get("/:id", (req, res) => {
    return res.json({ client: req.profile })
});


//clientById middlware
router.param("id", clientByID)

module.exports = router;