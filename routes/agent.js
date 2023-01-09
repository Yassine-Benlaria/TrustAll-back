const express = require("express")
const router = express.Router()
const cors = require("cors")
const {
    uploadId,
    uploadPassport,
    agentByID,
    getAgentsList,
    updateAgent,
    uploadProfilePicture,
    changeAgentPassword,
    addEmail,
    confirmNewEmail,
    resendConfirmEmail
} = require("../controllers/agent")
const { requireSignin, isAuth, isAgent } = require("../controllers/auth")
const { uploadImages, createReport } = require("../controllers/report");
const { passwordValidator } = require("../validators")
router.use(cors())

var multer = require('multer');
const { getCitiesList } = require("../validators/cities")
const { getCarCommandsByAgent, getMoneyCommandsByAgent } = require("../controllers/command")
var upload = multer();

//uploading report
router.post("/upload-report/:id", createReport)

//testing uploading multiple files
router.post("/test-upload", /*upload.array('uploadedImages'),*/ uploadImages)

//change password
router.post("/change-password/:id", passwordValidator, requireSignin, isAuth, changeAgentPassword);

//uploading id card / driving license
router.post("/upload_ID/:id", /*require signin */ uploadId)

//uploading passport
router.post("/upload_passport/:id", /*require signin*/ uploadPassport)

//get car commands by auth_agent
router.get("/car-commands/:id", getCarCommandsByAgent);

//get car commands by auth_agent
router.get("/money-commands/:id", getMoneyCommandsByAgent);

//add new email address
router.post("/new-email/:id", requireSignin, isAuth, addEmail)

//confirm new email 
router.post("/confirm-new-email/:id", requireSignin, isAuth, confirmNewEmail)

//resent confirmation code
router.post("/resend-confirm/:id", requireSignin, isAuth, resendConfirmEmail)


//update agent's info
router.post("/update/:id", updateAgent)

//get agents list (filtered)
router.get("/all", getAgentsList)

//get agent info
router.get("/:id", (req, res) => {
    return res.json({ agent: req.profile })
})

//upload profile pic
router.post("/photo/:id", uploadProfilePicture)

//get Authorized Agent by id
router.get("/:id/:lang", requireSignin, isAuth, isAgent, (req, res) => {
    let city = getCitiesList(req.params.lang).find(e => e.wilaya_code == req.profile.city).wilaya_name
    return res.json({ user: {...req.profile, city } });
});

//agentByID middlware
router.param("id", agentByID)

module.exports = router