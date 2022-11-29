const express = require("express")
const router = express.Router()
const cors = require("cors")
const { getAllCommands } = require("../controllers/command")
router.use(cors())

router.get("/", getAllCommands)

module.exports = router