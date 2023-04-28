const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Room = require("../models/room");
const Notification = require("../models/notification");
const Complain = require("../models/complain");
const moment = require("moment");
const Change = require("../models/roomChange");
const Leave = require("../models/leave");
const xlsx = require("xlsx");
const multer=require('multer');
const upload = multer({}).single("file");

//admin-home
module.exports.home = async (req, res) => {
  // console.log("Called", req.admin);
  let notifyLength = await Notification.find({ read: false }).count();
  // console.log(notifyLength);
  return res.status(200).json({
    message: "Admin Auth sucessfull",
    data: notifyLength,
  });
};
//dashboard data-:
module.exports.getDashboardData = async (req, res) => {
  try {
    let avaialbleCount = await Room.find({ status: "Available" }).count();
    // console.log(avaialbleCount);
    let unavaialbleCount = await Room.find({ status: "Not Available" }).count();
    // console.log(unavaialbleCount);
    /*
    let partialCount = await Room.find({
      status: "Available",
      personCount: 1,
    }).count();
    console.log(partialCount);
    */
    let allData = [avaialbleCount, unavaialbleCount];
    return res.status(200).json({
      message: "Got Data",
      data: allData,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};

//update password
module.exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    let currentAdmin = await Admin.findById(req.user._id);
    if (!newPassword) {
      return res.status(300).json({
        message: "New Password Cannot be empty",
      });
    }
    if (!currentAdmin) {
      return res.status(422).json({
        message: "Unauthorized access",
      });
    } else {
      const validation = await bcrypt.compare(
        oldPassword,
        currentAdmin.password
      );
      if (validation) {
        const hash = await bcrypt.hash(newPassword, saltRounds);
        currentAdmin.password = hash;
        currentAdmin.__v += 1;
        currentAdmin.save();
        return res.status(200).json({
          message: "Password has been Changed Sucessfully",
        });
      } else {
        return res.status(301).json({
          message: "please provide correct old password",
        });
      }
    }
  } catch (error) {
    console.log("Error");
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};

//registering admin only once-:
module.exports.createAdmin = async (req, res) => {
  try {
    const { name, id, password, desg } = req.body;
    if (!name || !id || !password || !desg) {
      return res.status(501).json({
        message: "fields cannot be empty",
      });
    }
    let allAdmins = await Admin.findOne({ username: id });
    if (!allAdmins) {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        Admin.create(
          {
            name,
            username: id,
            password: hash,
            desg,
          },
          async (err, user) => {
            if (err) {
              console.log("Error in admin creation");
              return res.status(301).json({
                message: "Error in admin creation",
              });
            } else {
              // console.log("Admin created sucessfully");
              return res.status(200).json({
                message: "Admin created sucessfully",
              });
            }
          }
        );
      });
    } else {
      console.log("admin with this id already exists");
      return res.redirect("back");
    }
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal Server error",
    });
  }
};

//admin login-:
module.exports.loginAdmin = async (req, res) => {
  try {
    const { id, password } = req.body;
    if (!id || !password) {
      return res.status(501).json({
        message: "fields cannot be empty",
      });
    }
    let findAdmin = await Admin.findOne({ username: id });
    if (!findAdmin) {
      return res.status(501).json({
        message: "Plzz enter a valid details to login",
      });
    } else {
      bcrypt.compare(password, findAdmin.password, function (err, result) {
        // result == true
        if (!result) {
          return res.status(422).json({
            message: "Plzz enter a valid details to login",
          });
        } else {
          // console.log("Login sucessfull-:",findAdmin);
          let token = jwt.sign(findAdmin.toJSON(), `${process.env.SECRET}`, {
            expiresIn: "10000000",
          });
          res.cookie("admin", token);
          return res.status(200).json({
            message: "Signin Successfull",
            data: token,
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal Server error",
    });
  }
};

//user-creation:✅
module.exports.registerUser = async (req, res) => {
  try {
    const { name, reg_no } = req.body;
    if (!name || !reg_no) {
      return res.status(422).json({
        message: "fields cannot be empty",
      });
    }
    let allUsers = await User.findOne({ reg_no });
    // let newUserId=[];
    if (!allUsers) {
      bcrypt.hash(reg_no, saltRounds, async (err, hash) => {
        let newUser = await User.create({
          name,
          reg_no,
          password: hash,
        });
        // newUserId.push(newUser._id);
      });
      return res.status(200).json({
        message:
          "User has been registered now he can login using id as registration number and password also registration number",
      });
    } else {
      console.log("User with this registration number already exists");
      return res.status(301).json({
        message:
          "User with this registration number already exists,,please login",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal Server error",
    });
  }
};

//complain resolution only by Admin-:
module.exports.getComplain = async (req, res) => {
  try {
    var date = moment();
    var currentDate = date.format("D/MM/YYYY");
    let cd = `${currentDate[0]}` + `${currentDate[1]}`;
    let currenComplains = [];
    let previousComplains = [];
    Complain.find({ status: "Not Resolved" })
      .populate("room")
      .populate("user")
      .exec(async (err, complains) => {
        if (complains.user === null) {
          return res.status(301).json({
            message: "User Left the Institute",
            data: complains,
          });
        }
        if (complains.length === 0) {
          // console.log("Complains-:",complains);
          return res.status(200).json({
            message: "No Un resolved Complain",
            data: complains,
          });
        }
        return res.status(200).json({
          message: "Here are your complains",
          data: complains,
        });
      });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal Server error",
    });
  }
};

//resolveComplain
module.exports.updateComplain = async (req, res) => {
  try {
    let { status } = req.body;
    let compId = req.params.id;
    const cd = Date.now();
    //formatting the date
    const getDate = (givenDate) => {
      const newDate = new Date(givenDate);
      const yyyy = newDate.getFullYear();
      let mm = newDate.getMonth() + 1; // Months start at 0!
      let dd = newDate.getDate();
      if (dd < 10) dd = "0" + dd;
      if (mm < 10) mm = "0" + mm;

      const formattedDate = dd + "/" + mm + "/" + yyyy;
      return formattedDate;
    };
    const res_date = getDate(cd);
    let currentComplain = await Complain.findOne({ _id: compId });
    if (!currentComplain) {
      return res.status(301).json({
        message: " Please enter a valid complain id",
      });
    } else {
      if (currentComplain.user_response.status === "Not Resolved") {
        return res.status(302).json({
          message: "User has not enterd any response",
        });
      } else if (currentComplain.status === "Resolved") {
        return res.status(303).json({
          message: "You have already resolved it",
        });
      } else {
        currentComplain.status = status;
        currentComplain.resolution_date = res_date;
        currentComplain.save();
        return res.status(200).json({
          message: "Users complain has been resolved",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal Server error",
    });
  }
};
// //single room allocation random
module.exports.singleRoom = async (req, res) => {
  try {
    const { user1 } = req.body;
    let firstUser = await User.findOne({ reg_no: user1.reg_no });
    const hash = await bcrypt.hash(user1.reg_no, saltRounds);
    let allRooms = await Room.find({ personCount: 0, status: "Available" });
    // console.log("Found-:",allRooms.length);
    let roomIndex = Math.floor(Math.random() * allRooms.length);
    let currentRoom = allRooms[roomIndex];
    // console.log("Room-:",currentRoom);
    if (!allRooms || allRooms.length === 0) {
      return res.status(422).json({
        message: "No Rooms Avaialable",
      });
    }

    if (!firstUser) {
      let newUser = await User.create({
        name: user1.name,
        reg_no: user1.reg_no,
        year: user1.year,
        password: hash,
        room: currentRoom._id,
      });
      currentRoom.user1 = newUser._id;
    } else {
      firstUser.room = currentRoom._id;
      firstUser.save();
    }
    currentRoom.status = "Not Available";
    currentRoom.personCount = 1;
    currentRoom.type = "Single";
    currentRoom.save();
    return res.status(200).json({
      message: "Room Allocated Sucessfully",
      data: currentRoom,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};

module.exports.singleRoomChoice = async (req, res) => {
  try {
    const { user1, room } = req.body;
    const { number, segment, floor } = room;
    let firstUser = await User.findOne({ reg_no: user1.reg_no });
    const hash = await bcrypt.hash(user1.reg_no, saltRounds);
    let allRooms = await Room.findOne({
      number,
      segment,
      floor,
      status: "Available",
      personCount: 0,
    });
    if (!allRooms || allRooms.length === 0) {
      return res.status(422).json({
        message: "No Rooms Avaialable",
      });
    }
    if (!firstUser) {
      let newUser = await User.create({
        name: user1.name,
        reg_no: user1.reg_no,
        year: user1.year,
        password: hash,
        room: allRooms._id,
      });
      allRooms.user1 = newUser._id;
    } else {
      firstUser.room = allRooms._id;
      firstUser.save();
    }
    allRooms.status = "Not Available";
    allRooms.personCount = 1;
    allRooms.type = "Single";
    allRooms.save();
    return res.status(200).json({
      message: "Room Allocated Sucessfully",
      data: allRooms,
    });
  } catch (error) {
    console.log("Error");
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};

//one route for random room allocation for without room mate-:
module.exports.doubleRoomWithoutRoommate = async (req, res) => {
  try {
    const { name, reg_no, year, mate } = req.body;
    if (!name || !reg_no || !year) {
      return res.status(512).json({
        message: "Fields Cannot be empty",
      });
    }
    let currentUser = await User.findOne({ reg_no });
    const hash = await bcrypt.hash(reg_no, saltRounds);
    if (!mate) {
      let allRooms = await Room.find({
        type: "Double",
        personCount: 0,
        status: "Available",
      });
      // console.log("ALL rooms-:",allRooms.length);
      let allRoomsWithOneStudent = await Room.find({
        type: "Double",
        personCount: 1,
        status: "Available",
      });
      let roomIndex = Math.floor(Math.random() * allRooms.length);
      // console.log("Rooom Index-:",roomIndex);
      let currentRoom = allRooms[roomIndex];
      // console.log("Rooom Curr-:",currentRoom);
      if (allRoomsWithOneStudent.length === 0) {
        if (!allRooms) {
          return res.status(422).json({
            message: "No Rooms avaialble for this category",
          });
        }
        if (!currentUser) {
          // console.log(currentRoom);
          let newUser = await User.create({
            name,
            reg_no,
            password: hash,
            year,
            room: currentRoom.id,
          });
          if (currentRoom.user1 === null) {
            currentRoom.user1 = newUser._id;
            // currentRoom.user2=null
          } else {
            currentRoom.user2 = newUser._id;
            // currentRoom.user1=null
          }
          currentRoom.personCount += 1;
          currentRoom.save();
        } else if (currentUser.room === null) {
          currentUser.room = currentRoom._id;
          currentUser.save();
          currentRoom.personCount += 1;
          if (currentRoom.user1 === null) {
            currentRoom.user1 = currentUser._id;
            // currentRoom.user2=null
          } else {
            currentRoom.user2 = currentUser._id;
            // currentRoom.user1=null
          }
          currentRoom.save();
        } else {
          return res.status(501).json({
            message: "Room Already Allocated To student",
          });
        }
        return res.status(200).json({
          message: "Room Allocated Sucessfully",
          data: currentRoom,
        });
      } else if (allRoomsWithOneStudent.length >= 1) {
        let nroomIndex = Math.floor(
          Math.random() * allRoomsWithOneStudent.length
        );
        let oneRoom = allRoomsWithOneStudent[nroomIndex];
        if (!currentUser) {
          // console.log("hash is-:",hash);
          let newUser = await User.create({
            name,
            reg_no,
            password: hash,
            year,
            room: oneRoom._id,
          });
          if (oneRoom.user1 === null) oneRoom.user1 = newUser._id;
          else oneRoom.user2 = newUser._id;

          oneRoom.personCount = 2;
          oneRoom.status = "Not Available";
          oneRoom.save();
        } else if (currentUser.room === null) {
          currentUser.room = oneRoom._id;
          currentUser.save();
          if (oneRoom.user1 === null) oneRoom.user1 = currentUser._id;
          else oneRoom.user2 = currentUser._id;
          oneRoom.personCount = 2;
          oneRoom.status = "Not Available";
          oneRoom.save();
        } else {
          return res.status(501).json({
            message: "Room Already Allocated To student",
          });
        }
        return res.status(200).json({
          message: "Room Allocated Sucessfully",
          data: oneRoom,
        });
      }
    } else {
      //room mate already exists
      let mateUser = await User.findOne({ reg_no: mate });
      // console.log("mate-:",mateUser);
      if (!mateUser || mateUser.room === null) {
        return res.status(504).json({
          message: "No User found with this registartion number",
        });
      } else {
        let mateRoom = await Room.findById(mateUser.room);
        // console.log("mate Room-:",mateRoom);
        if (
          !mateRoom ||
          mateRoom.personCount === 2 ||
          mateRoom.status === "Not Available" ||
          mateRoom.type === "Single"
        ) {
          return res.status(504).json({
            message: "No Room Exist with this id",
          });
        }
        if (!currentUser) {
          let newUser = await User.create({
            name,
            reg_no,
            password: hash,
            year,
            room: mateRoom._id,
          });
          if (mateRoom.user1 === null) {
            mateRoom.user1 = newUser._id;
          } else {
            mateRoom.user2 = newUser._id;
          }
        } else {
          currentUser.room = mateRoom._id;
          currentUser.save();
          if (mateRoom.user1 === null) {
            mateRoom.user1 = currentUser._id;
          } else {
            mateRoom.user2 = currentUser._id;
          }
        }
        mateRoom.personCount += 1;
        mateRoom.status = "Not Available";
        mateRoom.save();
        // console.log("Room After saving-:",mateRoom);

        return res.status(200).json({
          message: "Room Allocated Sucessfully",
          data: mateRoom,
        });
      }
    }
  } catch (error) {
    console.log("Error", error);
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};

//double room allocation with room mate-:
module.exports.allocateDouble = async (req, res) => {
  try {
    const { user1, user2 } = req.body;
    if (user1.year !== user2.year) {
      return res.status(301).json({
        message: "Cannot Allocate Room to students of different Year",
      });
    }
    let allRoom = await Room.find({
      type: "Double",
      status: "Available",
      personCount: 0,
    });
    if (!allRoom || allRoom.length === 0) {
      return res.status(422).json({
        message: "Not Rooms available",
      });
    }
    let roomIndex = Math.floor(Math.random() * allRoom.length);
    let currentRoom = allRoom[roomIndex];
    let firstUser = await User.findOne({ reg_no: user1.reg_no });
    let secondUser = await User.findOne({ reg_no: user2.reg_no });
    if (!firstUser && !secondUser) {
      const firstHash = await bcrypt.hash(user1.reg_no, saltRounds);
      const secondHash = await bcrypt.hash(user2.reg_no, saltRounds);
      let newFirstUser = await User.create({
        name: user1.name,
        reg_no: user1.reg_no,
        password: firstHash,
        year: user1.year,
        room: currentRoom._id,
      });
      let newSecondUser = await User.create({
        name: user2.name,
        reg_no: user2.reg_no,
        password: secondHash,
        year: user2.year,
        room: currentRoom._id,
      });
      currentRoom.user1 = newFirstUser._id;
      currentRoom.user2 = newSecondUser._id;
      currentRoom.status = "Not Available";
      currentRoom.personCount = 2;
      currentRoom.save();
      return res.status(200).json({
        message: "Room Allocated Sucessfully",
        data: currentRoom,
      });
    } else if (firstUser && secondUser) {
      currentRoom.user1 = firstUser._id;
      currentRoom.user2 = secondUser._id;
      currentRoom.status = "Not Available";
      currentRoom.personCount = 2;
      currentRoom.save();
      firstUser.room = currentRoom._id;
      firstUser.save();
      secondUser.room = currentRoom._id;
      secondUser.save();
      return res.status(200).json({
        message: "Room Allocated Sucessfully",
        data: currentRoom,
      });
    } else {
      return res.status(322).json({
        message: "Unable to allocate Room",
      });
    }
  } catch (error) {
    console.log("Error");
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};

module.exports.logout = async (req, res) => {
  try {
    res.clearCookie("admin");
    res.clearCookie("jwt");
    return res.status(200).json({
      message: "Logout Sucess",
    });
  } catch (error) {
    console.log("Error");
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};

//room finding
module.exports.findRoom = async (req, res) => {
  try {
    const { floor, segment } = req.body;
    if (!floor || !segment) {
      console.log("Fields cannot be empty");
      return res.status(301).json({
        message: "Fileds Cannot be empty",
      });
    } else {
      const allRooms = await Room.find({ floor, segment });
      if (!allRooms) {
        console.log("Error in finding Room");
        return res.status(422).json({
          message: "Error in finding Room",
        });
      } else {
        // console.log(allRooms.length);
        return res.status(200).json({
          message: "Found Rooms",
          data: allRooms,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};

module.exports.getRoomDetails = async (req, res) => {
  try {
    const rid = req.params.id;
    Room.findById(rid)
      .populate("user1")
      .populate("user2")
      .populate("warden")
      .exec(async (err, results) => {
        if (err) {
          console.log("Error---", err);
          return res.status(301).json({
            message: "Error in finding room",
            data: 0,
          });
        } else {
          // console.log(results);
          return res.status(200).json({
            message: "Room Details found",
            data: results,
          });
        }
      });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};

//Notifications
module.exports.getNotifications = async (req, res) => {
  try {
    let unreadNotify = await Notification.find({ read: false });
    let readNotify = await Notification.find({ read: true });
    if (!unreadNotify || !readNotify) {
      console.log("Error in finding Notifications");
      return res.status(301).json({
        message: "Error in finding Notifications",
      });
    } else {
      // console.log("Notifications", unreadNotify);
      return res.status(200).json({
        message: "All Notifications",
        unread: unreadNotify,
        read: readNotify,
      });
    }
  } catch (error) {
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};
//mark as read
module.exports.markasreadNotify = async (req, res) => {
  try {
    Notification.updateMany(
      { read: false },
      { $set: { read: true } },
      async (err, results) => {
        if (err) {
          return res.status(301).json({
            message: "Error in marking the notifications",
          });
        } else {
          // console.log(results);
          return res.status(200).json({
            message: "Notifcations Marked As Read",
          });
        }
      }
    );
  } catch (error) {
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};

//delete Notifications-:
module.exports.deleteAllNotify = async (req, res) => {
  try {
    Notification.deleteMany({}, (err, r) => {
      if (err) {
        return res.status(301).json({
          message: "Error in deleting the Notifications",
        });
      } else {
        return res.status(200).json({
          message: "Notifcations are deleted Successfully",
        });
      }
    });
  } catch (error) {
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};

//get all requests-:
module.exports.getReq = async (req, res) => {
  try {
    Change.find({ adminApproval: "Not Approved" })
      .populate("swapRoom")
      .exec((err, results) => {
        if (err) {
          return res.status(301).json({
            message: "Error in finding all the requests",
          });
        } else {
          // console.log(results);
          return res.status(200).json({
            message: "All Requests",
            request: results,
          });
        }
      });
  } catch (error) {
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};
const getRoomMateId = (room, cid) => {
  if (JSON.stringify(room.user1) == JSON.stringify(cid)) {
    return [room.user2, "user2"];
  } else if (JSON.stringify(room.user2) == JSON.stringify(cid)) {
    return [room.user1, "user1"];
  }
};
const getCurrentId = (room, cid) => {
  if (JSON.stringify(room.user1) == JSON.stringify(cid)) {
    return "user1";
  } else if (JSON.stringify(room.user2) == JSON.stringify(cid)) {
    return "user2";
  }
};
const getUser = (room) => {
  if (room.user1 === null) {
    return "user1";
  } else if (room.user2 === null) {
    return "user2";
  }
};

module.exports.allocateNewRoom = async (req, res) => {
  try {
    const request_id = req.params.id;
    const currentRequest = await Change.findById(request_id);
    if (!currentRequest) {
      return res.status(302).json({
        message: "Request is invalid",
      });
    } else {
      const { status } = req.body;
      if (status === "Not Approved") {
        return res.status(301).json({
          message: "Admin has declined the request",
        });
      }
      if (currentRequest.changeType === "New") {
        let currentRoom = await Room.findById(currentRequest.currentRoom);
        if (!currentRoom) {
          return res.status(301).json({
            message: "Unable to Find Room",
          });
        }
        if (currentRequest.allocationType === "Double") {
          if (currentRoom.user2 !== null) {
            if (
              currentRequest.studentApproval.length === 0 ||
              currentRequest.studentApproval[0].status !== "Approved"
            ) {
              return res.status(301).json({
                message: "User has Not Entered Any Response",
              });
            }
          }

          if (
            status === "Approved" ||
            currentRequest.studentApproval[0].status === "Approved"
          ) {
            // console.log(currentRoom);
            let newRoom = await Room.findOne({
              number: currentRequest.newDetails.rno,
              segment: currentRequest.newDetails.segment,
              floor: currentRequest.newDetails.floor,
            });
            if (!newRoom) {
              return res.status(301).json({
                message: "Unable to Find New Room",
              });
            } else {
              if (currentRequest.shiftCount === 1) {
                const currentUserField = getCurrentId(
                  currentRoom,
                  currentRequest.requestBy
                );
                const newRoomFiled = getUser(newRoom);
                // let t = currentRoom[currentUserField];
                // currentRoom[currentUserField] = newRoom[newRoomFiled];
                // newRoom[newRoomFiled] = t;
                newRoom[newRoomFiled] = currentRoom[currentUserField];
                currentRoom[currentUserField] = null;
                currentRoom.personCount -= 1;
                currentRoom.status = "Available";
                if (currentRoom.type === "Single") {
                  currentRoom.type = "Double";
                }
                currentRoom.save();
                if (newRoom.personCount === 1) {
                  newRoom.status = "Not Available";
                } else {
                  newRoom.status = "Available";
                }
                newRoom.personCount += 1;
                newRoom.save();
                let cu = await User.findById(currentRequest.requestBy);
                cu.room = newRoom._id;
                cu.save();
                currentRequest.adminApproval = status;
                currentRequest.save();
                return res.status(200).json({
                  message: "Room Changed Successfully",
                });
              } else {
                let userId1 = currentRoom.user1;
                let userId2 = currentRoom.user2;
                newRoom.user1 = userId1;
                newRoom.user2 = userId2;
                newRoom.personCount = currentRoom.personCount;
                if (currentRoom.personCount == 2) {
                  newRoom.status = currentRoom.status;
                } else newRoom.status = "Available";
                newRoom.save();
                currentRoom.user1 = null;
                currentRoom.user2 = null;
                currentRoom.personCount = 0;
                currentRoom.status = "Available";
                currentRoom.type = "Double";
                currentRoom.save();
                if (userId1 !== null) {
                  let fullUser1 = await User.findById(userId1);
                  fullUser1.room = newRoom._id;
                  fullUser1.save();
                }
                if (userId2 !== null) {
                  let fullUser2 = await User.findById(userId2);
                  fullUser2.room = newRoom._id;
                  fullUser2.save();
                }
                currentRequest.adminApproval = status;
                currentRequest.save();
                return res.status(200).json({
                  message: "Room Changed Successfully",
                });
              }
            }
          } else {
            return res.status(422).json({
              message: "Room Change is not approved",
            });
          }
        } else if (currentRequest.allocationType === "Single") {
          let currentRoom = await Room.findById(currentRequest.currentRoom);
          let currentUser = await User.findById(currentRequest.requestBy);
          if (!currentUser) {
            return res.status(301).json({
              message: "No User Found",
            });
          }
          if (currentRoom.user2 !== null) {
            if (
              currentRequest.studentApproval.length === 0 ||
              currentRequest.studentApproval[0].status !== "Approved"
            ) {
              return res.status(301).json({
                message: "User has Not Entered Any Response",
              });
            }
          }
          if (status === "Approved") {
            const newRoom = await Room.findOne({
              number: currentRequest.newDetails.rno,
              floor: currentRequest.newDetails.floor,
              segment: currentRequest.newDetails.segment,
              personCount: 0,
              status: "Available",
            });
            if (!newRoom) {
              return res.status(301).json({
                message: "Enter a valid room details",
              });
            }
            // const rid = getRoomMateId(currentRoom, currentRequest.requestBy);
            // console.log(rid);
            let cuField = getCurrentId(currentRoom, currentRequest.requestBy);
            // console.log(currentRoom[cuField]);
            newRoom.user1 = currentRequest.requestBy;
            newRoom.personCount += 1;
            newRoom.status = "Not Available";
            newRoom.type = "Single";
            newRoom.save();
            currentRoom[cuField] = null;
            currentRoom.personCount--;
            currentRoom.status = "Available";
            if (currentRoom.type === "Single") {
              currentRoom.type = "Double";
            }
            currentRoom.save();
            currentUser.room = newRoom._id;
            currentUser.save();
            currentRequest.adminApproval = status;
            currentRequest.save();
            return res.status(200).json({
              message: "Room changed successfully",
            });
          }
        }
      } else if (currentRequest.changeType === "Swap") {
        const swapRoom = await Room.findById(currentRequest.swapRoom);
        if (currentRequest.studentApproval.length < swapRoom.personCount + 1) {
          return res.status(301).json({
            message: "User has Not Entered Any Response",
          });
        }
        currentRequest.studentApproval.map((c, i) => {
          if (c.status !== "Approved") {
            return res.status(301).json({
              message: "User has not approved",
            });
          }
        });
        // console.log(swapRoom);
        if (!swapRoom) {
          return res.status(301).json({
            message: "Room Does Not exist",
          });
        }
        const newRoomMateId = getRoomMateId(
          swapRoom,
          currentRequest.newDetails.withUser
        );
        let swapuserField = newRoomMateId[1];

        let cRoom = await Room.findById(currentRequest.currentRoom);
        let currentuserField = getCurrentId(cRoom, currentRequest.requestBy);
        let cuserval = cRoom[currentuserField];
        cRoom[currentuserField] = swapRoom[swapuserField];
        swapRoom[swapuserField] = cuserval;
        if (swapRoom.personCount === 1) {
          swapRoom.personCount += 1;
        }
        if (newRoomMateId[0] === null) {
          cRoom.personCount -= 1;
        }
        cRoom.save();
        swapRoom.save();
        let currentUser = await User.findById(currentRequest.requestBy);
        currentUser.room = swapRoom._id;
        currentUser.save();
        // console.log(currentUser);

        if (newRoomMateId[0] !== null) {
          let newMateId = await User.findById(newRoomMateId[0]);
          newMateId.room = cRoom._id;
          newMateId.save();
        }

        currentRequest.adminApproval = "Approved";
        currentRequest.save();

        return res.status(200).json({
          message: `You have ${status} the request`,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};
/*
Changed
module.exports.allocateNewRoom = async (req, res) => {
  try {
    const request_id = req.params.id;
    const currentRequest = await Change.findById(request_id);
    if (!currentRequest) {
      return res.status(302).json({
        message: "Request is invalid",
      });
    } else {
      const { status } = req.body;
      if (status === "Not Approved") {
        return res.status(301).json({
          message: "Admin has declined the request",
        });
      }
      if (currentRequest.changeType === "New") {
        let currentRoom = await Room.findById(currentRequest.currentRoom);
        if (!currentRoom) {
          return res.status(301).json({
            message: "Unable to Find Room",
          });
        }
        if (currentRequest.allocationType === "Double") {
          if (currentRoom.user2 !== null) {
            if (
              currentRequest.studentApproval.length === 0 ||
              currentRequest.studentApproval[0].status !== "Approved"
            ) {
              return res.status(301).json({
                message: "User has Not Entered Any Response",
              });
            }
          }

          if (
            status === "Approved" ||
            currentRequest.studentApproval[0].status === "Approved"
          ) {
            // console.log(currentRoom);
            let newRoom = await Room.findOne({
              number: currentRequest.newDetails.rno,
              segment: currentRequest.newDetails.segment,
              floor: currentRequest.newDetails.floor,
            });
            if (!newRoom) {
              return res.status(301).json({
                message: "Unable to Find New Room",
              });
            } else {
              if (currentRequest.shiftCount === 1) {
                const currentUserField = getCurrentId(
                  currentRoom,
                  currentRequest.requestBy
                );
                const newRoomFiled = getUser(newRoom);
                // let t = currentRoom[currentUserField];
                // currentRoom[currentUserField] = newRoom[newRoomFiled];
                // newRoom[newRoomFiled] = t;
                newRoom[newRoomFiled] = currentRoom[currentUserField];
                currentRoom[currentUserField] = null;
                currentRoom.personCount -= 1;
                currentRoom.status = "Available";
                if (currentRoom.type === "Single") {
                  currentRoom.type = "Double";
                }
                currentRoom.save();
                if (newRoom.personCount === 1) {
                  newRoom.status = "Not Available";
                } else {
                  newRoom.status = "Available";
                }
                newRoom.personCount += 1;
                newRoom.save();
                let cu = await User.findById(currentRequest.requestBy);
                cu.room = newRoom._id;
                cu.save();
                currentRequest.adminApproval = status;
                currentRequest.save();
                return res.status(200).json({
                  message: "Room Changed Successfully",
                });
              } else {
                let userId1 = currentRoom.user1;
                let userId2 = currentRoom.user2;
                newRoom.user1 = userId1;
                newRoom.user2 = userId2;
                newRoom.personCount = currentRoom.personCount;
                if (currentRoom.personCount == 2) {
                  newRoom.status = currentRoom.status;
                } else newRoom.status = "Available";
                newRoom.save();
                currentRoom.user1 = null;
                currentRoom.user2 = null;
                currentRoom.personCount = 0;
                currentRoom.status = "Available";
                currentRoom.type = "Double";
                currentRoom.save();
                if (userId1 !== null) {
                  let fullUser1 = await User.findById(userId1);
                  fullUser1.room = newRoom._id;
                  fullUser1.save();
                }
                if (userId2 !== null) {
                  let fullUser2 = await User.findById(userId2);
                  fullUser2.room = newRoom._id;
                  fullUser2.save();
                }
                currentRequest.adminApproval = status;
                currentRequest.save();
                return res.status(200).json({
                  message: "Room Changed Successfully",
                });
              }
            }
          } else {
            return res.status(422).json({
              message: "Room Change is not approved",
            });
          }
        } else if (currentRequest.allocationType === "Single") {
          let currentRoom = await Room.findById(currentRequest.currentRoom);
          let currentUser = await User.findById(currentRequest.requestBy);
          if (!currentUser) {
            return res.status(301).json({
              message: "No User Found",
            });
          }
          if (currentRoom.user2 !== null) {
            if (
              currentRequest.studentApproval.length === 0 ||
              currentRequest.studentApproval[0].status !== "Approved"
            ) {
              return res.status(301).json({
                message: "User has Not Entered Any Response",
              });
            }
          }
          if (status === "Approved") {
            const newRoom = await Room.findOne({
              number: currentRequest.newDetails.rno,
              floor: currentRequest.newDetails.floor,
              segment: currentRequest.newDetails.segment,
              personCount: 0,
              status: "Available",
            });
            if (!newRoom) {
              return res.status(301).json({
                message: "Enter a valid room details",
              });
            }
            // const rid = getRoomMateId(currentRoom, currentRequest.requestBy);
            // console.log(rid);
            let cuField = getCurrentId(currentRoom, currentRequest.requestBy);
            // console.log(currentRoom[cuField]);
            newRoom.user1 = currentRequest.requestBy;
            newRoom.personCount += 1;
            newRoom.status = "Not Available";
            newRoom.type = "Single";
            newRoom.save();
            currentRoom[cuField] = null;
            currentRoom.personCount--;
            currentRoom.status = "Available";
            if (currentRoom.type === "Single") {
              currentRoom.type = "Double";
            }
            currentRoom.save();
            currentUser.room = newRoom._id;
            currentUser.save();
            currentRequest.adminApproval = status;
            currentRequest.save();
            return res.status(200).json({
              message: "Room changed successfully",
            });
          }
        }
      } else if (currentRequest.changeType === "Swap") {
        const swapRoom = await Room.findById(currentRequest.swapRoom);
        if (currentRequest.studentApproval.length < swapRoom.personCount + 1) {
          return res.status(301).json({
            message: "User has Not Entered Any Response",
          });
        }
        currentRequest.studentApproval.map((c, i) => {
          if (c.status !== "Approved") {
            return res.status(301).json({
              message: "User has not approved",
            });
          }
        });
        // console.log(swapRoom);
        if (!swapRoom) {
          return res.status(301).json({
            message: "Room Does Not exist",
          });
        }
        const newRoomMateId = getRoomMateId(
          swapRoom,
          currentRequest.newDetails.withUser
        );
        let swapuserField = newRoomMateId[1];
        let cRoom = await Room.findById(currentRequest.currentRoom);
        let currentuserField = getCurrentId(cRoom, currentRequest.requestBy);
        let cuserval = cRoom[currentuserField];
        cRoom[currentuserField] = swapRoom[swapuserField];
        swapRoom[swapuserField] = cuserval;
        cRoom.save();
        swapRoom.save();
        let currentUser = await User.findById(currentRequest.requestBy);
        currentUser.room = swapRoom._id;
        currentUser.save();
        let newMateId = await User.findById(newRoomMateId[0]);
        newMateId.room = cRoom._id;
        newMateId.save();

        currentRequest.adminApproval = "Approved";
        currentRequest.save();

        return res.status(200).json({
          message: `You have ${status} the request`,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};
*/
/*
//room-change-to-new-room both users-:
module.exports.allocateNewRoom = async (req, res) => {
  try {
    const request_id = req.params.id;
    const currentRequest = await Change.findById(request_id);
    if (!currentRequest) {
      return res.status(302).json({
        message: "Request is invalid",
      });
    } else {
      const { status } = req.body;
      if (status === "Not Approved") {
        return res.status(301).json({
          message: "Admin has declined the request",
        });
      }
      if (currentRequest.changeType === "New") {
        let currentRoom = await Room.findById(currentRequest.currentRoom);
        if (currentRoom.user2 !== null) {
          if (
            currentRequest.studentApproval.length === 0 ||
            currentRequest.studentApproval[0].status !== "Approved"
          ) {
            return res.status(301).json({
              message: "User has Not Entered Any Response",
            });
          }
        }

        if (
          status === "Approved" ||
          currentRequest.studentApproval[0].status === "Approved"
        ) {
          if (!currentRoom) {
            return res.status(301).json({
              message: "Unable to Find Users current Room",
            });
          } else {
            console.log(currentRoom);
            let newRoom = await Room.findOne({
              number: currentRequest.newDetails.rno,
              segment: currentRequest.newDetails.segment,
              floor: currentRequest.newDetails.floor,
            });
            if (!newRoom) {
              return res.status(301).json({
                message: "Unable to Find New Room",
              });
            } else {
              let userId1 = currentRoom.user1;
              let userId2 = currentRoom.user2;
              newRoom.user1 = userId1;
              newRoom.user2 = userId2;
              newRoom.personCount = currentRoom.personCount;
              if (currentRoom.personCount == 2) {
                newRoom.status = currentRoom.status;
              } else newRoom.status = "Available";
              newRoom.save();
              currentRoom.user1 = null;
              currentRoom.user2 = null;
              currentRoom.personCount = 0;
              currentRoom.status = "Available";
              currentRoom.type = "Double";
              currentRoom.save();
              if (userId1 !== null) {
                let fullUser1 = await User.findById(userId1);
                fullUser1.room = newRoom._id;
                fullUser1.save();
              }
              if (userId2 !== null) {
                let fullUser2 = await User.findById(userId2);
                fullUser2.room = newRoom._id;
                fullUser2.save();
              }
              currentRequest.adminApproval = status;
              currentRequest.save();
              return res.status(200).json({
                message: "Room Changed Successfully",
              });
            }
          }
        } else {
          return res.status(422).json({
            message: "Room Change is not approved",
          });
        }
      } else if (currentRequest.changeType === "Swap") {
        if (currentRequest.studentApproval.length < 3) {
          return res.status(301).json({
            message: "User has Not Entered Any Response",
          });
        }
        currentRequest.studentApproval.map((c, i) => {
          if (c.status !== "Approved") {
            return res.status(301).json({
              message: "User has not approved",
            });
          }
        });
        const swapRoom = await Room.findById(currentRequest.swapRoom);
        // console.log(swapRoom);
        if (!swapRoom) {
          return res.status(301).json({
            message: "Room Does Not exist",
          });
        }
        const newRoomMateId = getRoomMateId(
          swapRoom,
          currentRequest.newDetails.withUser
        );
        let swapuserField = newRoomMateId[1];
        let cRoom = await Room.findById(currentRequest.currentRoom);
        let currentuserField = getCurrentId(cRoom, currentRequest.requestBy);
        let cuserval = cRoom[currentuserField];
        cRoom[currentuserField] = swapRoom[swapuserField];
        swapRoom[swapuserField] = cuserval;
        cRoom.save();
        swapRoom.save();
        let currentUser = await User.findById(currentRequest.requestBy);
        currentUser.room = swapRoom._id;
        currentUser.save();
        let newMateId = await User.findById(newRoomMateId[0]);
        newMateId.room = cRoom._id;
        newMateId.save();

        currentRequest.adminApproval = "Approved";
        currentRequest.save();

        return res.status(200).json({
          message: `You have ${status} the request`,
        });
      } else if (currentRequest.changeType === "Single") {
        let currentRoom = await Room.findById(currentRequest.currentRoom);
        let currentUser = await User.findById(currentRequest.requestBy);
        if (!currentUser) {
          return res.status(301).json({
            message: "No User Found",
          });
        }
        if (currentRoom.user2 !== null) {
          if (
            currentRequest.studentApproval.length === 0 ||
            currentRequest.studentApproval[0].status !== "Approved"
          ) {
            return res.status(301).json({
              message: "User has Not Entered Any Response",
            });
          }
        }
        if (status === "Approved") {
          const newRoom = await Room.findOne({
            number: currentRequest.newDetails.rno,
            floor: currentRequest.newDetails.floor,
            segment: currentRequest.newDetails.segment,
            personCount: 0,
            status: "Available",
          });
          if (!newRoom) {
            return res.status(301).json({
              message: "Enter a valid room details",
            });
          }
          // const rid = getRoomMateId(currentRoom, currentRequest.requestBy);
          // console.log(rid);
          let cuField = getCurrentId(currentRoom, currentRequest.requestBy);
          console.log(currentRoom[cuField]);
          newRoom.user1 = currentRequest.requestBy;
          newRoom.personCount = 1;
          newRoom.status = "Not Available";
          newRoom.type = "Single";
          newRoom.save();
          currentRoom[cuField] = null;
          currentRoom.personCount--;
          currentRoom.status = "Available";
          currentRoom.save();
          currentUser.room = newRoom._id;
          currentUser.save();
          currentRequest.adminApproval = status;
          currentRequest.save();
          return res.status(200).json({
            message: "Room changed successfully",
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};
*/
//all-leave
module.exports.findLeave = async (req, res) => {
  try {
    const allleave = await Leave.find({}).populate("user");
    if (!allleave || allleave.length === 0) {
      return res.status(301).json({
        message: "No Leave Found",
        data: [],
      });
    }
    // console.log(allleave);
    return res.status(200).json({
      message: "All Leave-:",
      data: allleave,
    });
  } catch (error) {
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};
//get-leave by leave Number-:
module.exports.getLeaveByNumber = async (req, res) => {
  try {
    const { leaveNo } = req.body;
    const currentLeave = await Leave.findOne({ leaveNo }).populate("user");
    if (!currentLeave) {
      return res.status(301).json({
        message: "Please enter a valid leave number",
        data: {},
      });
    }
    // console.log(currentLeave);
    return res.status(200).json({
      message: "Got Your Leave",
      data: currentLeave,
    });
  } catch (error) {
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};

//handle-excel file
module.exports.getFile = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        console.log(err);
        return res.status(301).json({
          message: err,
        });
      }
      if (req.file) {
        const fileBuffer = req.file.buffer;
        // console.log("body", fileBuffer);
        const workbook = xlsx.read(fileBuffer);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);
        // console.log("Data", data);
        for (let d of data) {
          const hashPassword = await bcrypt.hash(
            `${d.Registration_Number}`,
            saltRounds
          );
          // console.log(hashPassword);
          let newUser = await User.create({
            name: d.Name,
            reg_no: d.Registration_Number,
            password: hashPassword,
            year: d.Year,
          });
          let roomWithOne = await Room.findOne({
            status: "Available",
            type: "Double",
            personCount: 1,
          });
          let roomWithZero = await Room.findOne({
            status: "Available",
            type: "Double",
            personCount: 0,
          });
          if (!roomWithOne) {
            //zero vala room lo
            // console.log("Zero me aaya");
            let userType = getUser(roomWithZero);
            roomWithZero[userType] = newUser._id;
            roomWithZero.personCount += 1;
            if (
              roomWithZero.personCount === 1 ||
              roomWithZero.personCount === 0
            ) {
              roomWithZero.status = "Available";
            }
            roomWithZero.save();
            newUser.room = roomWithZero._id;
            newUser.save();
          } else {
            // console.log("One me aaya");
            if (roomWithOne.personCount === 1) {
              roomWithOne.status = "Not Available";
            } else {
              roomWithOne.status = "Available";
            }
            let userType = getUser(roomWithOne);
            roomWithOne[userType] = newUser._id;
            roomWithOne.personCount += 1;
            roomWithOne.save();
            newUser.room = roomWithOne._id;
            newUser.save();
          }
        }
        return res.status(200).json({
          message: "User Registered and Room Allocated successfully",
        });
      } else {
        // console.log(req.file);
        return res.status(301).json({
          message: "No File Present",
        });
      }
    });
  } catch (error) {
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};

//trying the api
module.exports.practice = async (req, res) => {
  try {
    console.log("called");

    return res.status(200).json({
      message: "Wow",
    });
  } catch (error) {
    console.log("Error");
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};
