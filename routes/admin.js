const express = require("express")
const router = express.Router()
const cors = require("cors")
const { createAgent, adminByID, createAuthAgent, createAdmin } = require("../controllers/admin")
router.use(cors())


//create an admin account
router.post("/create_admin/:id", createAdmin)

//create agent account
router.post("/create_agent/:id", createAgent)

//create auth-agent account
router.post("/create_auth_agent/:id", createAuthAgent)

//admin by id API
router.get("/:id", (req, res) => {
    return res.json(req.profile)
})

//admin by id middlware
router.param("id", adminByID)

module.exports = router;