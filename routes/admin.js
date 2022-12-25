const express = require("express")
const router = express.Router()
const cors = require("cors")
const { createAgent, adminByID, createAuthAgent, createAdmin, updateAdmin, createPlan } = require("../controllers/admin")
const { validator } = require("../validators")
const { isAuth, requireSignin, isAdmin } = require("../controllers/auth")

router.use(cors())

//create an admin account
router.post("/create_admin/:id" /*, validator*/ , createAdmin)

//create agent account
router.post("/create_agent/:id", createAgent)

//update admin's info
router.post("/update/:id", updateAdmin)

//create auth-agent account
router.post("/create_auth_agent/:id", createAuthAgent)

//admin by id API
router.get("/:id/:lang", (req, res) => {
    return res.json({ user: req.profile })
})


//create new plan
router.post("/create_plan/:id", requireSignin, isAuth, isAdmin, createPlan)

//admin by id middlware
router.param("id", adminByID)

module.exports = router;