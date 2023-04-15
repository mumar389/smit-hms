const express = require("express");
const router = express.Router();
const leaveControl = require("../controller/leave_controller");
router.get("/:id",leaveControl.getLeaveById);
router.post('/approve/:id',leaveControl.approveLeaveByparent)
// router.get('/get-request',)

module.exports = router;
