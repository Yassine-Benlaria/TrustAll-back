const express = require("express")
const router = express.Router()
const cors = require("cors")
const { signup, confirmEmail, clientByID, getClientsList, updateClient, uploadProfilePicture, changeClientPassword } = require("../controllers/client")
const { validator, clientUpdateValidator, passwordValidator } = require("../validators")
const { isAuth, requireSignin } = require("../controllers/auth")
router.use(cors())

//signup route
router.post("/signup", validator, signup)

//email confirmation route
router.post("/confirm/:id", confirmEmail)

//get clients list
router.get("/all", getClientsList)

//get client info
router.get("/:id/:lang", requireSignin, isAuth, (req, res) => {
    return res.json({ user: req.profile })
});

//change password
router.post("/change-password/:id", passwordValidator, requireSignin, isAuth, changeClientPassword);

//upload profile pic
router.post("/photo/:id", uploadProfilePicture)

//update client's info (first_name, last_name or birth_date)
router.post("/update/:id", requireSignin, isAuth, clientUpdateValidator, updateClient)

//clientById middlware
router.param("id", clientByID)

module.exports = router;