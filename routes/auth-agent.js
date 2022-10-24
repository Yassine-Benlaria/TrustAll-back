const express = require("express")
const router = express.Router()
const cors = require("cors")
const { authAgentByID, getAuthAgentsList, updateAuthAgent, uploadProfilePicture } = require("../controllers/auth-agent")
router.use(cors())


//get AuthAgents list (filtered)
router.get("/all", getAuthAgentsList)

//get Authorized Agent by id
router.get("/:id", (req, res) => {
    return res.json(req.profile)
});

//update authAgent's info
router.post("/update/:id", updateAuthAgent)

//upload profile picture
router.post("/photo/:id", uploadProfilePicture)

//authAgent by id middlware
router.param("id", authAgentByID)

module.exports = router