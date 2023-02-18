const express = require("express")
const router = express.Router()
const cors = require("cors")
const {
    authAgentByID,
    getAuthAgentsList,
    updateAuthAgent,
    uploadProfilePicture,
    createAgent,
    getAgentsList,
    changeAuthAgentPassword,
    addEmail,
    confirmNewEmail,
    resendConfirmEmail,
    uploadId,
    uploadPassport,
    getNotificationList,
    getNotificationByID,
    deleteNotification
} = require("../controllers/auth-agent")
const {
    requireSignin,
    isAuth,
    isAdmin,
    isAdminOrAgent,
    isAuthAgent,
    isActive,
    isVerified
} = require("../controllers/auth")
const { getCitiesList } = require("../validators/cities")
const {
    getCarCommandsByAuthAgent,
    getMoneyCommandsByAuthAgent,
    confirmCommandByAuthAgent,
    assignSellerAgent,
    assignClientAgent,
    confirmPaymentByAuthAgent,
    cancelCommand,
    recoverCommand,
    getCanceledCommandsByAuthAgent
} = require("../controllers/command")
const { getAgentsNamesByAuthAgent, deleteAgent } = require("../controllers/agent")
const { createReport, getReport, getCompletedReport, getCarsListByAuthAgent } = require("../controllers/report")
const { passwordValidator } = require("../validators")
router.use(cors())

//get AuthAgents list (filtered)
router.get("/all/:lang", requireSignin, isAuth, isAdmin, getAuthAgentsList);

//get agents names by auth agent
router.get("/agents/names/:id", requireSignin, isAuth, isAuthAgent, isVerified, getAgentsNamesByAuthAgent)

//get car commands by auth_agent
router.get("/car-commands/:id", requireSignin, isAuth, isAuthAgent, isVerified, getCarCommandsByAuthAgent);

//get cars by auth-agent
router.get("/cars/:id", requireSignin, isAuth, isAuthAgent, isVerified, getCarsListByAuthAgent);

//get canceled commands by auth_agent
router.get("/canceled-commands/:id", requireSignin, isAuth, isAuthAgent, isVerified, getCanceledCommandsByAuthAgent);

//cancel command
router.post("/cancel-command/:id", /* requireSignin, isAuth, isVerified,  */ cancelCommand);

//recover command
router.post("/recover-command/:id", requireSignin, isAuth, isVerified, recoverCommand);

//get money commands by auth_agent
router.get("/money-commands/:id", requireSignin, isAuth, isAuthAgent, isVerified, getMoneyCommandsByAuthAgent);

//upload report
router.post("/upload-report/:id", requireSignin, isAuth, isAuthAgent, isVerified, createReport);

//upload id
router.post("/upload-ID/:id", requireSignin, isAuth, uploadId)

//upload passport
router.post("/upload-passport/:id", requireSignin, isAuth, uploadPassport)

//get report
router.get("/report/:id", requireSignin, isAuth, isAuthAgent, isVerified, getReport);

//
router.get("/get-report/:id", requireSignin, isAuth, isAuthAgent, isVerified, getCompletedReport);

//get agents list
router.get("/agent/all/:id/:lang", requireSignin, isAuth, isAuthAgent, isVerified, getAgentsList)

//update authAgent's info
router.post("/update/:id", requireSignin, isAuth, updateAuthAgent);

//add new email address
router.post("/new-email/:id", requireSignin, isAuth, addEmail)

//confirm new email 
router.post("/confirm-new-email/:id", requireSignin, isAuth, confirmNewEmail)

//resent confirmation code
router.post("/resend-confirm/:id", requireSignin, isAuth, resendConfirmEmail)

//upload profile picture
router.post("/photo/:id", requireSignin, isAuth, isAuthAgent, uploadProfilePicture);

//change authagent password
router.post("/change-password/:id", passwordValidator, requireSignin, isAuth, changeAuthAgentPassword);

//confirm command
router.post("/confirm-command/:id", requireSignin, isAuth, isAuthAgent, isVerified, confirmCommandByAuthAgent);

//assign seller-side agent to command
router.post("/assign-verification/:id", requireSignin, isAuth, isAuthAgent, isVerified, assignSellerAgent);

//assign seller-client agent to command
router.post("/assign-payment/:id", requireSignin, isAuth, isAuthAgent, isVerified, assignClientAgent);


//get notifications list
router.get("/notifications/:id", requireSignin, isAuth, isAuthAgent, getNotificationList)

//get notification by id
router.get("/notification/:id/:notification_id", requireSignin, isAuth, isAuthAgent, getNotificationByID)

//confirm payment by auth agent
router.post("/confirm-payment/:id", requireSignin, isAuth, isAuthAgent, isVerified, confirmPaymentByAuthAgent);

//create agent
router.post("/create-agent/:id", requireSignin, isAuth, isAuthAgent, isVerified, createAgent);

//get Authorized Agent by id
router.get("/:id/:lang", requireSignin, isAuth, isAdminOrAgent, (req, res) => {
    let city = getCitiesList(req.params.lang).find(e => e.wilaya_code == req.profile.city).wilaya_name
    return res.json({ user: {...req.profile, city } });
});

//delete notification
router.delete("/notification/:id/:notification_id", requireSignin, isAuth, deleteNotification)

//delete agent
router.delete("/agent/:id", requireSignin, isAuth, isAuthAgent, isVerified, deleteAgent)

//authAgent by id middlware
router.param("id", authAgentByID)


module.exports = router