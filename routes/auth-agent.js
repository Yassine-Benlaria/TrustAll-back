const express = require("express")
const router = express.Router()
const cors = require("cors")
const { authAgentByID, getAuthAgentsList, updateAuthAgent, uploadProfilePicture } = require("../controllers/auth-agent")
const { requireSignin, isAuth, isAdmin, isAdminOrAgent } = require("../controllers/auth")
const { getCitiesList } = require("../validators/cities")
router.use(cors())


//get AuthAgents list (filtered)
router.get("/all/:lang", requireSignin, isAuth, isAdmin, getAuthAgentsList)


//update authAgent's info
router.post("/update/:id", updateAuthAgent)

//upload profile picture
router.post("/photo/:id", uploadProfilePicture)

//get Authorized Agent by id
router.get("/:id/:lang", requireSignin, isAuth, isAdminOrAgent, (req, res) => {
    let city = getCitiesList(req.params.lang).find(e => e.wilaya_code == req.profile.city).wilaya_name
    return res.json({ user: {...req.profile, city } })
});

//authAgent by id middlware
router.param("id", authAgentByID)

module.exports = router