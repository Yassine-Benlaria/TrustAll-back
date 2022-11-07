const express = require("express")
const router = express.Router()
const cors = require("cors")
router.use(cors())
const { getCitiesList, getDirasList } = require("../validators/cities")

router.get("/cities/:lang", (req, res) => {
    return res.json({ cities: getCitiesList(req.params.lang) })
})

module.exports = router