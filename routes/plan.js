const express = require("express")
const router = express.Router()
const cors = require("cors")
const { getPlans, getPlansFormatted, planById } = require("../controllers/plan")
router.use(cors())

router.get("/all/:lang", getPlans)
router.get("/all-formatted/:lang", getPlansFormatted)
router.get("/:id/:lang", planById)

module.exports = router