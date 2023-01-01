const express = require("express")
const router = express.Router()
const cors = require("cors")
const { uploadId, uploadPassport, agentByID, getAgentsList, updateAgent, uploadProfilePicture } = require("../controllers/agent")
const { uploadImages, createReport } = require("../controllers/report")
router.use(cors())

var multer = require('multer');
var upload = multer();

//uploading report
router.post("/upload-report/:id", createReport)

//testing uploading multiple files
router.post("/test-upload", /*upload.array('uploadedImages'),*/ uploadImages)

//uploading id card / driving license
router.post("/upload_ID/:id", /*require signin */ uploadId)

//uploading passport
router.post("/upload_passport/:id", /*require signin*/ uploadPassport)

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

//agentByID middlware
router.param("id", agentByID)

module.exports = router