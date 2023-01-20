const express = require("express")
const router = express.Router()
const cors = require("cors")

const {
    createAgent,
    adminByID,
    createAuthAgent,
    createAdmin,
    updateAdmin,
    createPlan,
    addEmail,
    confirmNewEmail,
    resendConfirmEmail,
    changeAdminPassword,
    getSubAdminsList,
    deleteUser,
    getUnverifiedEmployees,
    acceptAuthAgentID,
    declineAuthAgentID,
    acceptAgentID,
    declineAgentID,
    uploadProfilePicture,
    getNotificationList,
    deletePlan,
    getNotificationByID
} = require("../controllers/admin")
const {
    validator,
    passwordValidator,
    createAuthAgentValidator
} = require("../validators")
const {
    isAuth,
    requireSignin,
    isAdmin,
    isMainAdmin
} = require("../controllers/auth")
const {
    deactivateAuthAgent,
    getAuthAgentsList,
    activateAuthAgent,
    getAuthAgentsNames
} = require("../controllers/auth-agent")
const {
    getAgentsList,
    deactivateAgent,
    activateAgent
} = require("../controllers/agent")
const {
    getClientsList
} = require("../controllers/client")
const { createReport, getCompletedReport, getReport } = require("../controllers/report")
const { getCarCommandsByAdmin, getMoneyCommandsByAdmin, confirmCommandByAuthAgent } = require("../controllers/command")
const { getPlanOptions } = require("../controllers/plan")

router.use(cors())

//upload report
router.post("/upload-report/:id", requireSignin, isAuth, isAdmin, createReport)

//get plan options
router.get("/plan-options/:id/:lang", requireSignin, isAuth, isAdmin, getPlanOptions)

//get car commands by auth_agent
router.get("/car-commands/:id", requireSignin, isAuth, isAdmin, getCarCommandsByAdmin);

//get money commands by auth_agent
router.get("/money-commands/:id", requireSignin, isAuth, isAdmin, getMoneyCommandsByAdmin);

//get unverified employees
router.get("/unverified/:id/:lang", requireSignin, isAuth, isAdmin, getUnverifiedEmployees)

//get sub admins list
router.get("/sub-admin/all/:id/:lang", requireSignin, isAuth, isAdmin, isMainAdmin, getSubAdminsList)

//get auth agents list
router.get("/auth-agent/all/:id/:lang", requireSignin, isAuth, isAdmin, getAuthAgentsList)

//get auth agents names
router.get("/auth-agent/names/:id/:lang", requireSignin, isAuth, isAdmin, getAuthAgentsNames)

//get agents list
router.get("/agent/all/:id/:lang", requireSignin, isAuth, isAdmin, getAgentsList)


//get notifications list
router.get("/notifications/:id", /*  requireSignin, isAuth, isAdmin, */ getNotificationList)

//get notification by id
router.get("/notification/:id/:notification_id", /* requireSignin, isAuth, isAdmin, */ getNotificationByID)

//get report
router.get("/report/:id", requireSignin, isAuth, isAdmin, getReport);

router.get("/get-report/:id", requireSignin, isAuth, isAdmin, getCompletedReport);

//get clients list
router.get("/client/all/:id/:lang", requireSignin, isAuth, isAdmin, getClientsList)

//change password
router.post("/change-password/:id", passwordValidator, requireSignin, isAuth, changeAdminPassword);

//create an admin account
router.post("/create-sub-admin/:id", requireSignin, isAuth, isAdmin, createAuthAgentValidator, createAdmin)

//create agent account
router.post("/create-agent/:id", requireSignin, isAuth, isAdmin, createAgent)

//update admin's info
router.post("/update/:id", requireSignin, isAuth, isAdmin, updateAdmin)

//create auth-agent account
router.post("/create-auth-agent/:id", createAuthAgentValidator, requireSignin, isAuth, isAdmin, createAuthAgent)

//deactivate auth-agent
router.post("/deactivate-auth-agent/:id", requireSignin, isAuth, isAdmin, deactivateAuthAgent)

//activate auth-agent
router.post("/activate-auth-agent/:id", requireSignin, isAuth, isAdmin, activateAuthAgent)

//deactivate agent
router.post("/deactivate-agent/:id", requireSignin, isAuth, isAdmin, deactivateAgent)

//activate agent
router.post("/activate-agent/:id", requireSignin, isAuth, isAdmin, activateAgent)

//deactivate client
// router.post("/deactivate-client/:id", requireSignin, isAuth, isAdmin, deactivateClient)

//activate client
// router.post("/activate-client/:id", requireSignin, isAuth, isAdmin, activateClient)
router.post("/confirm-command/:id", requireSignin, isAuth, isAdmin, confirmCommandByAuthAgent);


//add new email address
router.post("/new-email/:id", requireSignin, isAuth, addEmail)

//confirm new email 
router.post("/confirm-new-email/:id", requireSignin, isAuth, confirmNewEmail)

//resent confirmation code
router.post("/resend-confirm/:id", requireSignin, isAuth, resendConfirmEmail)

//create new plan
router.post("/create-plan/:id", requireSignin, isAuth, isAdmin, createPlan)

//accept and decline auth-agent
router.post("/accept-auth-agent/:id", requireSignin, isAuth, isAdmin, acceptAuthAgentID);
router.post("/decline-auth-agent/:id", requireSignin, isAuth, isAdmin, declineAuthAgentID);

//upload profile picture
router.post("/photo/:id", requireSignin, isAuth, isAdmin, uploadProfilePicture);


//accept and decline agent
router.post("/accept-agent/:id", requireSignin, isAuth, isAdmin, acceptAgentID);
router.post("/decline-agent/:id", requireSignin, isAuth, isAdmin, declineAgentID);

//admin by id API
router.get("/:id/:lang", requireSignin, isAuth, (req, res) => {
    return res.json({ user: req.profile })
})

//delete a plan
router.delete("/plan/:id/:plan_id", requireSignin, isAuth, isAdmin, deletePlan)

//delete user
router.delete("/:id", requireSignin, isAuth, isAdmin, deleteUser)

//admin by id middlware
router.param("id", adminByID)

module.exports = router;