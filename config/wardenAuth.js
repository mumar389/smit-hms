const Warden = require("../models/warden");
const jwt = require("jsonwebtoken");
module.exports.authenticate = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    var authorization = req.headers.authorization.split(" ")[1],
      decoded;
    // console.log("Auth", authorization);
    try {
      decoded = jwt.verify(authorization, `${process.env.SECRET}`);
    } catch (e) {
      return res.status(422).json({
        message: "UnAuthorized Access",
      });
    }
    var wId = decoded._id;
    // Fetch the user by id
    Warden.findOne({ _id: wId }).then(function (warden) {
      // Do something with the user
      req.warden = warden;
      return next();
    });
  } else {
    return res.status(422).json({
      message: "Invalid credentials",
    });
  }
};
