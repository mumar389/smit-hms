const express = require("express");
const router = express.Router();
const passport = require("passport");
const adminControl = require("../controller/admin_controller");
const adminAuth = require("../config/adminAuth");

// router.post('/create-admin',adminControl.createAdmin);
router.post("/login-admin", adminControl.loginAdmin);
router.get(
  "/dashboard-data",
  adminAuth.Authenticate,
  adminControl.getDashboardData
);
router.post(
  "/register-user",
  adminAuth.Authenticate,
  adminControl.registerUser
);
router.post(
  "/handle-file",
  adminControl.getFile
);
router.get("/verify-admin", adminAuth.Authenticate, adminControl.home);

// //single room
router.post(
  "/single-room-random",
  adminAuth.Authenticate,
  adminControl.singleRoom
);
router.post(
  "/single-room-choice",
  adminAuth.Authenticate,
  adminControl.singleRoomChoice
);

//double room without room mate-:
router.post(
  "/double-room",
  adminAuth.Authenticate,
  adminControl.doubleRoomWithoutRoommate
);
//double room with roommate
router.post(
  "/double-room-mate",
  adminAuth.Authenticate,
  adminControl.allocateDouble
);

//update password
router.post(
  "/update-password",
  adminAuth.Authenticate,
  adminControl.updatePassword
);

//complains fetching and resolution-:
router.get("/get-complain", adminAuth.Authenticate, adminControl.getComplain);

//resolving the complain
router.post(
  "/resolve-complain/:id",
  adminAuth.Authenticate,
  adminControl.updateComplain
);
//admin--logout
router.post("/logout", adminAuth.Authenticate, adminControl.logout);

//admin update password-:
router.post(
  "/update-password",
  adminAuth.Authenticate,
  adminControl.updatePassword
);

//room-search
router.post("/get-rooms", adminAuth.Authenticate, adminControl.findRoom);
//get-Notification
router.get(
  "/get-notify",
  adminAuth.Authenticate,
  adminControl.getNotifications
);
router.post(
  "/mark-notify",
  adminAuth.Authenticate,
  adminControl.markasreadNotify
);
router.delete(
  "/delete-notify",
  adminAuth.Authenticate,
  adminControl.deleteAllNotify
);
router.get("/get-req", adminAuth.Authenticate, adminControl.getReq);
router.get(
  "/get-details/:id",
  adminAuth.Authenticate,
  adminControl.getRoomDetails
);

router.post(
  "/modify-req/:id",
  adminAuth.Authenticate,
  adminControl.allocateNewRoom
);
router.get("/all-leave", adminAuth.Authenticate, adminControl.findLeave);
router.post(
  "/leave-number",
  adminAuth.Authenticate,
  adminControl.getLeaveByNumber
);

//practice route-:
router.post("/practice", adminControl.practice);

module.exports = router;
