const express = require("express");
const router = express.Router();
const passport = require("passport");

// router.post('');
router.use("/admin", require("./admin"));
router.use("/users", require("./user"));
router.use("/wardens", require("./warden"));
router.use('/leaves',require('./leave'))
module.exports = router;
