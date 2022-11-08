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
        cities: getCitiesList(req.params.lang).sort(compare)
    })
})

router.get("/dairas/:city/:lang", (req, res) => {
    return res.json({ dairas: getDirasList(req.params.city, req.params.lang).sort() })
})

function compare(a, b) {
    if (a.key < b.key) {
        return -1;
    }
    if (a.key > b.key) {
        return 1;
    }
    return 0;
}

module.exports = router;