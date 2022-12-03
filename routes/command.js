const express = require("express")
const router = express.Router()
const cors = require("cors")
const { getAllCommands } = require("../controllers/command")
router.use(cors())
const url = require('url');



//get list of commands
router.get("/", getAllCommands)

//test parsing url
router.get("/search-command", (req, res) => {
    res.send(req.query)
})

module.exports = router