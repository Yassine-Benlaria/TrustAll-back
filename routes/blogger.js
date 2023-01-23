const { requireSignin, isAuth } = require("../controllers/auth");
const { bloggerByID, uploadId, uploadPassport, updateBlogger, changeBloggerPassword, addEmail, confirmNewEmail, resendConfirmEmail, uploadProfilePicture } = require("../controllers/blogger");
const { passwordValidator } = require("../validators");
const { getCitiesList } = require("../validators/cities");

const express = require("express"),
    router = express.Router(),
    cors = require("cors");
router.use(cors());

//upload profile pic
router.post("/photo/:id", requireSignin, isAuth, uploadProfilePicture);

//add new email address
router.post("/new-email/:id", requireSignin, isAuth, addEmail)

//confirm new email 
router.post("/confirm-new-email/:id", requireSignin, isAuth, confirmNewEmail)

//resent confirmation code
router.post("/resend-confirm/:id", requireSignin, isAuth, resendConfirmEmail)

//change password
router.post("/change-password/:id", passwordValidator, requireSignin, isAuth, changeBloggerPassword);

//update blogger's info
router.post("/update/:id", requireSignin, isAuth, updateBlogger)

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