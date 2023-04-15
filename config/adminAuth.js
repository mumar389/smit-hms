const Admin = require("../models/admin");

const jwt = require("jsonwebtoken");
module.exports.Authenticate = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    var authorization = req.headers.authorization.split(" ")[1],
      decoded;
    // console.log("Auth", authorization);
    try {
      decoded = jwt.verify(authorization, `${process.env.SECRET}`);
    //   console.log(decoded);
    } catch (e) {
      return res.status(422).json({
        message: "UnAuthorized Access",
      });
    }
    var aId = decoded._id;
    // Fetch the user by id
    Admin.findOne({ _id: aId }).then(function (admin) {
      // Do something with the user
    //   console.log(admin);
      req.admin = admin;
      return next();
    });
  } else {
    return res.status(422).json({
      message: "Invalid credentials",
    });
  }
};
