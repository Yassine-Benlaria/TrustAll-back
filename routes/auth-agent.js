const express = require("express")
const router = express.Router()
const cors = require("cors")
const { authAgentByID, getAuthAgentsList } = require("../controllers/auth-agent")
router.use(cors())


//get AuthAgents list (filtered)
router.get("/all", getAuthAgentsList)

//authAgent by id middlware
router.param("id", authAgentByID)

module.exports = router