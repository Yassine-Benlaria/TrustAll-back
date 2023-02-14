const express = require("express")
const router = express.Router()
const cors = require("cors")
const { signup, confirmEmail, clientByID, addEmail, getClientsList, updateClient, uploadProfilePicture, changeClientPassword, confirmNewEmail, resendConfirmEmail, deleteClient } = require("../controllers/client")
const { validator, clientUpdateValidator, passwordValidator, addCommandValidator } = require("../validators")
const { isAuth, requireSignin, isActive, isVerified } = require("../controllers/auth")
const {
    addCommand,
    getCommandsByClientID,
    confirmPaymentByClient,
    getClientCommandByID,
    /* , clientE_Payment */
    clientCancelCommand
} = require("../controllers/command")
const { getCompletedReport } = require("../controllers/report")
router.use(cors())

//signup route
router.post("/signup", validator, signup)

//email confirmation route
router.post("/confirm/:id", requireSignin, isAuth, confirmEmail);

//get commands
router.get("/commands/:id", requireSignin, isAuth, isVerified, isActive, getCommandsByClientID);

//get command
router.get("/command/:id", requireSignin, isAuth, isVerified, getClientCommandByID);

//cancel command
router.post("/cancel-command/:id", requireSignin, isAuth, isVerified, clientCancelCommand);

//change password
router.post("/change-password/:id", requireSignin, isAuth, isVerified, passwordValidator, changeClientPassword);

//upload profile pic
router.post("/photo/:id", requireSignin, isAuth, uploadProfilePicture);

//update client's info (first_name, last_name or birth_date)
router.post("/update/:id", requireSignin, isAuth, isVerified, clientUpdateValidator, updateClient);

//add new email address
router.post("/new-email/:id", requireSignin, isAuth, isVerified, addEmail);

//confirm new email
router.post("/confirm-new-email/:id", requireSignin, isAuth, isVerified, confirmNewEmail);

//get report
router.get("/get-report/:id", requireSignin, isAuth, isVerified, getCompletedReport);

//resent confirmation code
router.post("/resend-confirm/:id", requireSignin, isAuth, resendConfirmEmail);

//confirm payment by client
router.post("/confirm-payment/:id", requireSignin, isAuth, isVerified, confirmPaymentByClient);

//client e-payment
// router.post("/e-payment/:id", clientE_Payment)

//add new command
router.post("/add-command/:id", requireSignin, isAuth, isVerified, addCommandValidator, addCommand)

//get client info
router.get("/:id/:lang", requireSignin, isAuth, isVerified, (req, res) => {
    return res.json({ user: req.profile })
});

//delete client
router.delete("/:id/", requireSignin, isAuth, isVerified, deleteClient)

//clientById middlware
router.param("id", clientByID)

module.exports = router;