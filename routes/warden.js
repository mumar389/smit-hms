const express = require("express");
const router = express.Router();
const wardenControl = require("../controller/warden_controller");
const wardenAuth = require("../config/wardenAuth");

router.post("/login", wardenControl.loginWarden);

router.get("/verify", wardenAuth.authenticate, wardenControl.verifyWarden);
router.post(
  "/update-password",
  wardenAuth.authenticate,
  wardenControl.updatePassword
);
router.get("/all-req", wardenAuth.authenticate, wardenControl.leaveRequest);
router.post(
  "/approve-leave/:id",
  wardenAuth.authenticate,
  wardenControl.approveLeave
);
router.post(
  "/logout",
  wardenAuth.authenticate,
  wardenControl.logoutWarden
);

module.exports = router;
