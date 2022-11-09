const express = require("express");
const router = express.Router()
const cors = require("cors");
const { signIn, signout } = require("../controllers/auth");
router.use(cors());
const { getCitiesList, getDirasList } = require("../validators/cities")

router.post("/signin", signIn);

router.post("/signout", signout)


router.get("/cities/:lang", (req, res) => {
    return res.json({
        cities: getCitiesList(req.params.lang) //.sort(compare)
    })
})

router.get("/dairas/:wilaya_code/:lang", (req, res) => {
    let dairas = getDirasList(req.params.wilaya_code, req.params.lang)
    return res.json({
        dairas
    })
});


module.exports = router;