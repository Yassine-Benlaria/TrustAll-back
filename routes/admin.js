const express = require("express")
const router = express.Router()
const cors = require("cors")
const { createAgent, adminByID, createAuthAgent, createAdmin, updateAdmin, createPlan, addEmail, confirmNewEmail, resendConfirmEmail, changeAdminPassword } = require("../controllers/admin")
const { validator, passwordValidator } = require("../validators")
const { isAuth, requireSignin, isAdmin } = require("../controllers/auth")
const { deactivateAuthAgent, getAuthAgentsList } = require("../controllers/auth-agent")
const { getAgentsList, deactivateAgent } = require("../controllers/agent")

router.use(cors())

//get auth agents list
router.get("/auth-agent/all/:id/:lang", /* requireSignin, isAuth, isAdmin,*/ getAuthAgentsList)

//get auth agents list
router.get("/agent/all/:id/:lang", /*requireSignin, isAuth, isAdmin,*/ getAgentsList)

//change password
router.post("/change-password/:id", passwordValidator, requireSignin, isAuth, changeAdminPassword);

//create an admin account
router.post("/create_admin/:id" /*, validator*/ , createAdmin)

//create agent account
router.post("/create_agent/:id", createAgent)

//update admin's info
router.post("/update/:id", updateAdmin)

//create auth-agent account
router.post("/create_auth_agent/:id", createAuthAgent)

//deactivate auth-agent
router.post("/deactivate-auth-agent/:id", deactivateAuthAgent)

//deactivate agent
router.post("/deactivate-agent/:id", deactivateAgent)


//add new email address
router.post("/new-email/:id", requireSignin, isAuth, addEmail)

//confirm new email
router.post("/confirm-new-email/:id", requireSignin, isAuth, confirmNewEmail)

//resent confirmation code
router.post("/resend-confirm/:id", requireSignin, isAuth, resendConfirmEmail)

//create new plan
router.post("/create_plan/:id", requireSignin, isAuth, isAdmin, createPlan)

//admin by id API
router.get("/:id/:lang", (req, res) => {
    return res.json({ user: req.profile })
})

//admin by id middlware
router.param("id", adminByID)

module.exports = router;