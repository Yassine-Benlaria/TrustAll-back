const express = require("express");
const router = express.Router()
const cors = require("cors");
const { signIn, signout } = require("../controllers/auth");
router.use(cors());
const { getCitiesList, getDirasList } = require("../validators/cities")

router.post("/signin", signIn);

router.post("/signout", signout)


router.get("/cities/:lang", (req, res) => {
    return res.json(getCitiesList(req.params.lang).sort())
})

router.get("/dairas/:city/:lang", (req, res) => {
    return res.json(getDirasList(req.params.city, req.params.lang).sort())
})



module.exports = router;