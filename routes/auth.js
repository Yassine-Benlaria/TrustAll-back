const express = require("express");
const router = express.Router()
const cors = require("cors");
const { signIn, signout } = require("../controllers/auth");
router.use(cors());

router.post("/signin", signIn);

router.post("/signout", signout)
module.exports = router;