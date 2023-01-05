const express = require("express")
const router = express.Router()
const cors = require("cors")
const { signup, confirmEmail, clientByID, addEmail, getClientsList, updateClient, uploadProfilePicture, changeClientPassword, confirmNewEmail, resendConfirmEmail, deleteClient } = require("../controllers/client")
const { validator, clientUpdateValidator, passwordValidator, addCommandValidator } = require("../validators")
const { isAuth, requireSignin, isActive, isVerified } = require("../controllers/auth")
const { addCommand, getCommandsByClientID } = require("../controllers/command")
router.use(cors())

//signup route
router.post("/signup", validator, signup)

//email confirmation route
router.post("/confirm/:id", requireSignin, isAuth, confirmEmail)

//get commands
router.get("/commands/:id", requireSignin, isAuth, isVerified, isActive, getCommandsByClientID)

//get clients list
// router.get("/all/:lang", getClientsList)


//change password
router.post("/change-password/:id", requireSignin, isAuth, isVerified, passwordValidator, changeClientPassword);

//upload profile pic
router.post("/photo/:id", requireSignin, isAuth, isVerified, uploadProfilePicture)

//update client's info (first_name, last_name or birth_date)
router.post("/update/:id", requireSignin, isAuth, isVerified, clientUpdateValidator, updateClient)

//add new email address
router.post("/new-email/:id", requireSignin, isAuth, isVerified, addEmail)

//confirm new email
router.post("/confirm-new-email/:id", requireSignin, isAuth, isVerified, confirmNewEmail)

//resent confirmation code
router.post("/resend-confirm/:id", requireSignin, isAuth, isVerified, resendConfirmEmail)

//add new command
router.post("/add-command/:id", /*requireSignin, isAuth, isVerified,*/ addCommandValidator, addCommand)

//get client info
router.get("/:id/:lang", requireSignin, isAuth, isVerified, (req, res) => {
    return res.json({ user: req.profile })
});

//delete client
router.delete("/:id/", deleteClient)

//clientById middlware
router.param("id", clientByID)

module.exports = router;