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

//get blogger info
router.get("/:id/:lang", requireSignin, isAuth, (req, res) => {
    return res.json({ user: req.profile })
});

//BloggerByID middleware
router.param("id", bloggerByID)
module.exports = router;