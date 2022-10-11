const express = require("express")
const router = express.Router()
const cors = require("cors")
const { createAgent } = require("../controllers/admin")
router.use(cors())

//create agent account
router.post("/create_agent/:id", createAgent)

module.exports = router;