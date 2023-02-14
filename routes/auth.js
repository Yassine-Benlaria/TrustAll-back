const express = require("express");
const router = express.Router()
const cors = require("cors");
const { signIn, signout, postReset, checkPasswordToken, resetPassword, communesByCity } = require("../controllers/auth");
router.use(cors());
const { getCitiesList, getDirasList, getCommunesListByDaira, getCommunesListByCity } = require("../validators/cities");
const { passwordValidator } = require("../validators");
const { getBlogById, getBlogs } = require("../controllers/blog");
const { getSettings } = require("../controllers/settings");
const { exec } = require("child_process");

//testing python
router.get("/python", (req, res) => {
    exec("ls", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return res.status(400).json({ err: "err" });
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return res.status(400).json({ err: "stderr" });
        }
        console.log(`stdout: ${stdout}`);
        return res.json({ msg: stdout });
    });
})

//getSettings
router.get("/settings", getSettings);

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

//request to reset password
router.post("/reset", postReset)

//
router.post("/test", (req, res) => {
    console.log(req)
    res.send("test")
})

//check reset password token
router.get("/check-token/:token", checkPasswordToken);

//set new password
router.post("/reset-password", passwordValidator, resetPassword)

//get communes by daira
router.get("/communes/:daira/:lang", (req, res) => {

    let communes = getCommunesListByDaira(req.params.daira, req.params.lang)
    return res.json({
        communes
    })
});

//get communes by daira
router.get("/communes-by-city/:city/:lang", communesByCity);

//get logo
router.get("/logo", (req, res) => {
    let path = require('path');
    res.sendFile(path.resolve('public/logo.png'))
});

//get blog by id
router.get("/blog/:blog_id", getBlogById);

//get blogs
router.get("/blogs", getBlogs);

//get communes list
module.exports = router;