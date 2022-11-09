const express = require("express");
const router = express.Router()
const cors = require("cors");
const { signIn, signout } = require("../controllers/auth");
router.use(cors());
const { getCitiesList, getDirasList, getCommunesList } = require("../validators/cities")


//SignIn api
router.post("/signin", signIn);

//SignOut api
router.post("/signout", signout)


//Get wilayas list
router.get("/cities/:lang", (req, res) => {
    return res.json({
        cities: getCitiesList(req.params.lang) //.sort(compare)
    })
})

//get Dairas list
router.get("/dairas/:wilaya_code/:lang", (req, res) => {
    let dairas = getDirasList(req.params.wilaya_code, req.params.lang)
    return res.json({
        dairas
    })
});

router.get("/communes/:daira/:lang", (req, res) => {
    let communes = getCommunesList(req.params.daira, req.params.lang)
    return res.json({
        communes
    })
});

//get communes list
module.exports = router;