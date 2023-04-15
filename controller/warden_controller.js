const Warden = require("../models/warden");
const Leave = require("../models/leave");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

//warden password adding
module.exports.addPassword = async (req, res) => {
  try {
    let allWardens = await Warden.find();
    allWardens.map(async (cw, i) => {
      //   const hashPassword = await bcrypt.hash("warden", saltRounds);
      //   cw.password = hashPassword;
      let wid = `warden@00${i + 1}`;
      console.log(wid);
      cw.id = wid;
      cw.save();
    });
    return res.status(200).json({
      message: "Wardens id have been set",
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal Server error",
    });
  }
};

module.exports.verifyWarden = async (req, res) => {
  try {
    // console.log("Warden-:", req.warden);
    return res.status(200).json({
      message: "Warden verified",
      data: req.warden,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal Server error",
    });
  }
};

//warden login
module.exports.loginWarden = async (req, res) => {
  try {
    const { id, password } = req.body;
    if (!id || !password) {
      return res.status(501).json({
        message: "fields cannot be empty",
      });
    }
    const currentWarden = await Warden.findOne({ id });
    // console.log(currentWarden);
    if (!currentWarden) {
      return res.status(301).json({
        message: "Warden not found",
      });
    }
    bcrypt.compare(password, currentWarden.password, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(301).json({
          message: "Unable to login",
        });
      }
      if (!result) {
        return res.status(301).json({
          message: "id or password is incorrect in result",
        });
      } else {
        let token = jwt.sign(currentWarden.toJSON(), `${process.env.SECRET}`, {
          expiresIn: "10000000",
        });
        res.cookie("warden", token);
        return res.status(200).json({
          message: "Warden Found",
          data: token,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal Server error",
    });
  }
};
//warden-requests
module.exports.leaveRequest = async (req, res) => {
  try {
    let allLeave = await Leave.find({ warden: req.warden._id }).populate(
      "user"
    );
    if (!allLeave) {
      return res.status(301).json({
        message: "No Leaves Found",
      });
    }
    // console.log(allLeave);
    return res.status(200).json({
      message: "All Leaves",
      data: allLeave,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal Server error",
    });
  }
};
//approve the leave-:
module.exports.approveLeave = async (req, res) => {
  try {
    const { status } = req.body;
    const lid = req.params.id;
    const currentLeave = await Leave.findById(lid);
    if (!currentLeave) {
      return res.status(301).json({
        message: "No Leave exists for this id",
      });
    }
    if (
      JSON.stringify(currentLeave.warden) !== JSON.stringify(req.warden._id)
    ) {
      return res.status(422).json({
        message: "You are not authorized to manupulate this leave",
      });
    }
    if (
      currentLeave.parentApproval !== "Approved" ||
      currentLeave.parentApproval === "Not Approved"
    ) {
      return res.status(301).json({
        message: "Parent has not responded yet!",
      });
    }
    if (currentLeave.wardenApproval === "Approved") {
      return res.status(301).json({
        message: "You have already Approved it!",
      });
    }
    currentLeave.wardenApproval = status;
    currentLeave.save();
    return res.status(200).json({
      message: `Leave ${status} by You`,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal Server error",
    });
  }
};

//update-password
module.exports.updatePassword = async (req, res) => {
  try {
    const { oldP, newP } = req.body;
    if (!oldP || !newP) {
      return res.status(301).json({
        message: "fields cannot be empty",
      });
    }
    // console.log(req.user);
    const currentWarden = await Warden.findById(req.user._id);
    if (!currentWarden) {
      return res.status(301).json({
        message: "Warden Not Found",
      });
    }
    bcrypt.compare(oldP, currentWarden.password, async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(301).json({
          message: "Unable to login",
        });
      }
      if (!result) {
        return res.status(301).json({
          message: "id or password is incorrect",
        });
      } else {
        let newpHash = await bcrypt.hash(newP, saltRounds);
        currentWarden.password = newpHash;
        currentWarden.save();
        res.clearCookie("warden");
        return res.status(200).json({
          message: "Password Updated",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal Server error",
    });
  }
};

//logout
module.exports.logoutWarden = async (req, res) => {
  try {
    req.logout(async (err, wardens) => {
      if (err) {
        return res.status(501).json({
          message: "Failed to logout",
        });
      } else {
        res.clearCookie("warden");
        return res.status(200).json({
          message: "Logout sucess",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal Server error",
    });
  }
};
