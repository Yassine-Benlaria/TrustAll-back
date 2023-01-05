const express = require("express")
const router = express.Router()
const cors = require("cors")
const { authAgentByID, getAuthAgentsList, updateAuthAgent, uploadProfilePicture } = require("../controllers/auth-agent")
const { requireSignin, isAuth, isAdmin, isAdminOrAgent, isAuthAgent, isActive, isVerified } = require("../controllers/auth")
const { getCitiesList } = require("../validators/cities")
const { getCarCommandsByAuthAgent, getMoneyCommandsByAuthAgent, confirmCommandByAuthAgent } = require("../controllers/command")
router.use(cors())

//get AuthAgents list (filtered)
router.get("/all/:lang", requireSignin, isAuth, isAdmin, getAuthAgentsList)

//get car commands by auth_agent
router.get("/car-commands/:id", getCarCommandsByAuthAgent);

//get money commands by auth_agent
router.get("/money-commands/:id", getMoneyCommandsByAuthAgent);

//update authAgent's info
router.post("/update/:id", updateAuthAgent)

//upload profile picture
router.post("/photo/:id", uploadProfilePicture)

//confirm command
router.post("/confirm-command/:id", /* requireSignin, isAuth, isAuthAgent, isVerified, */ confirmCommandByAuthAgent)

//get Authorized Agent by id
router.get("/:id/:lang", requireSignin, isAuth, isAdminOrAgent, (req, res) => {
    let city = getCitiesList(req.params.lang).find(e => e.wilaya_code == req.profile.city).wilaya_name
    return res.json({ user: {...req.profile, city } })
});


//authAgent by id middlware
router.param("id", authAgentByID)


module.exports = router