const express = require("express");
const router = express.Router();
const passport = require("passport");
const userControl = require("../controller/users_controller");

router.post(
  "/change-password",
  passport.authenticate("jwt", { session: false }),
  userControl.updatePassword
);
router.get(
  "/verify-user",
  passport.authenticate("jwt", { session: false }),
  userControl.verifyUser
);
router.post("/create-session", userControl.loginUser);
router.post(
  "/register-complain",
  passport.authenticate("jwt", { session: false }),
  userControl.createComplain
);
router.get(
  "/fetch-complain",
  passport.authenticate("jwt", { session: false }),
  userControl.getComplain
);
router.post(
  "/update-complain/:id",
  passport.authenticate("jwt", { session: false }),
  userControl.updateComplain
);
router.delete(
  "/delete-complain/:id",
  passport.authenticate("jwt", { session: false }),
  userControl.deleteComplain
);
//router.get('/details',passport.authenticate('jwt', { session: false }),userControl.getDetails);
//router.get('/room-detials',passport.authenticate('jwt', { session: false }),userControl.getRoommate)
router.get(
  "/full-details",
  passport.authenticate("jwt", { session: false }),
  userControl.getFullDetails
);
router.post(
  "/signout",
  passport.authenticate("jwt", { session: false }),
  userControl.logout
);
router.post(
  "/create-request",
  passport.authenticate("jwt", { session: false }),
  userControl.roomChangeRequest
);

router.get(
  "/get-request",
  passport.authenticate("jwt", { session: false }),
  userControl.sendRequest
);

router.post(
  "/modify-request/:id",
  passport.authenticate("jwt", { session: false }),
  userControl.modifyRequest
);
router.delete(
  "/delete-request/:id",
  passport.authenticate("jwt", { session: false }),
  userControl.deleteRequest
);
//leave apply
router.post(
  "/apply-leave",
  passport.authenticate("jwt", { session: false }),
  userControl.applyLeave
);
router.get(
  "/get-leave",
  passport.authenticate("jwt", { session: false }),
  userControl.getLeave
);
router.delete(
  "/remove-leave/:id",
  passport.authenticate("jwt", { session: false }),
  userControl.deleteLeave
);

module.exports = router;
