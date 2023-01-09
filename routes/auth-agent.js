const express = require("express")
const router = express.Router()
const cors = require("cors")
const { authAgentByID, getAuthAgentsList, updateAuthAgent, uploadProfilePicture, createAgent, getAgentsList, changeAuthAgentPassword, addEmail, confirmNewEmail, resendConfirmEmail } = require("../controllers/auth-agent")
const { requireSignin, isAuth, isAdmin, isAdminOrAgent, isAuthAgent, isActive, isVerified } = require("../controllers/auth")
const { getCitiesList } = require("../validators/cities")
const { getCarCommandsByAuthAgent, getMoneyCommandsByAuthAgent, confirmCommandByAuthAgent, assignSellerAgent, assignClientAgent, confirmPaymentByAuthAgent } = require("../controllers/command")
const { getAgentsNamesByAuthAgent, deleteAgent } = require("../controllers/agent")
const { createReport, getReport } = require("../controllers/report")
const { passwordValidator } = require("../validators")
router.use(cors())

//get AuthAgents list (filtered)
router.get("/all/:lang", requireSignin, isAuth, isAdmin, getAuthAgentsList);

//get agents names by auth agent
router.get("/agents/names/:id", getAgentsNamesByAuthAgent)

//get car commands by auth_agent
router.get("/car-commands/:id", getCarCommandsByAuthAgent);

//get money commands by auth_agent
router.get("/money-commands/:id", getMoneyCommandsByAuthAgent);

//upload report
router.post("/upload-report/:id", createReport);

//get report
router.get("/report/:id", getReport);

//get agents list
router.get("/agent/all/:id/:lang", requireSignin, isAuth, isAuthAgent, getAgentsList)


//update authAgent's info
router.post("/update/:id", updateAuthAgent);


//add new email address
router.post("/new-email/:id", requireSignin, isAuth, addEmail)

//confirm new email 
router.post("/confirm-new-email/:id", requireSignin, isAuth, confirmNewEmail)

//resent confirmation code
router.post("/resend-confirm/:id", requireSignin, isAuth, resendConfirmEmail)


//upload profile picture
router.post("/photo/:id", uploadProfilePicture);

//change authagent password
router.post("/change-password/:id", passwordValidator, requireSignin, isAuth, changeAuthAgentPassword);

//confirm command
router.post("/confirm-command/:id", /* requireSignin, isAuth, isAuthAgent, isVerified, */ confirmCommandByAuthAgent);

//assign seller-side agent to command
router.post("/assign-verification/:id", /* requireSignin, isAuth, isAuthAgent, isVerified, */ assignSellerAgent);

//assign seller-client agent to command
router.post("/assign-payment/:id", /* requireSignin, isAuth, isAuthAgent, isVerified, */ assignClientAgent);

//confirm payment by auth agent
router.post("/confirm-payment/:id", /* requireSignin, isAuth, isAuthAgent, isVerified, */ confirmPaymentByAuthAgent);


//create agent
router.post("/create-agent/:id", createAgent);

//get Authorized Agent by id
router.get("/:id/:lang", requireSignin, isAuth, isAdminOrAgent, (req, res) => {
    let city = getCitiesList(req.params.lang).find(e => e.wilaya_code == req.profile.city).wilaya_name
    return res.json({ user: {...req.profile, city } });
});

//delete agent
router.delete("/agent/:id", deleteAgent)

//authAgent by id middlware
router.param("id", authAgentByID)


module.exports = router