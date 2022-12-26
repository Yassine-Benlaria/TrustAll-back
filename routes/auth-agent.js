const express = require("express")
const router = express.Router()
const cors = require("cors")
const { authAgentByID, getAuthAgentsList, updateAuthAgent, uploadProfilePicture } = require("../controllers/auth-agent")
const { requireSignin, isAuth, isAdmin, isAdminOrAgent } = require("../controllers/auth")
router.use(cors())


//get AuthAgents list (filtered)
router.get("/all", requireSignin, isAuth, isAdmin, getAuthAgentsList)

//get Authorized Agent by id
router.get("/:id", requireSignin, isAuth, isAdminOrAgent, (req, res) => {
    return res.json(req.profile)
});

//update authAgent's info
router.post("/update/:id", updateAuthAgent)

//upload profile picture
router.post("/photo/:id", uploadProfilePicture)

//authAgent by id middlware
router.param("id", authAgentByID)

module.exports = router