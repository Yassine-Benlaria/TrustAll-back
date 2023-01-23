const { requireSignin, isAuth } = require("../controllers/auth");
const { bloggerByID, uploadId, uploadPassport } = require("../controllers/blogger");

const express = require("express"),
    router = express.Router(),
    cors = require("cors");
router.use(cors());



//uploading id card / driving license
router.post("/upload-ID/:id", requireSignin, isAuth, uploadId)

//uploading passport
router.post("/upload-passport/:id", requireSignin, isAuth, uploadPassport)

//get Blogger by id
router.get("/:id/:lang", requireSignin, isAuth, (req, res) => {
    let city = getCitiesList(req.params.lang).find(e => e.wilaya_code == req.profile.city).wilaya_name
    return res.json({ user: {...req.profile, city } });
});


//BloggerByID middleware
router.param("id", bloggerByID)
module.exports = router;