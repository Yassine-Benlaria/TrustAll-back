const express = require("express")
const router = express.Router()
const cors = require("cors")
const { getPlans } = require("../controllers/plan")
router.use(cors())

router.get("/all/:lang", getPlans)

module.exports = router