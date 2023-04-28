const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Complain = require("../models/complain");
const Notification = require("../models/notification");
const Room = require("../models/room");
const moment = require("moment");
const saltRounds = 10;
const Warden = require("../models/warden");
const Change = require("../models/roomChange");
const Leave = require("../models/leave");
//verifying user login
module.exports.verifyUser = async (req, res) => {
  // console.log("User has been verified by passport");
  // console.log("user-:", req.user);
  User.findOne({ reg_no: req.user.reg_no })
    .populate("room")
    .exec(async (err, result) => {
      return res.status(200).json({
        message: "You have been verified",
        data: result,
      });
    });
};

//login for users-:
module.exports.loginUser = async (req, res) => {
  try {
    const { id, password } = req.body;
    if (!id || !password) {
      return res.status(501).json({
        message: "fields cannot be empty",
      });
    }
    let currentUser = await User.findOne({ reg_no: id });
    if (!currentUser) {
      return res.status(422).json({
        message: "Unauthorized Access",
      });
    } else {
      bcrypt.compare(password, currentUser.password, function (err, result) {
        if (!result) {
          return res.status(422).json({
            message: "Unauthorized Access",
          });
        } else {
          let token = jwt.sign(currentUser.toJSON(), `${process.env.SECRET}`, {
            expiresIn: "10000000",
          });
          res.cookie("jwt", token);
          res.cookie("user", currentUser._id);
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

//update password for user
module.exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword) {
      return res.status(301).json({
        message: "Please Provide Your Old Password for verification",
      });
    }
    let currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(422).json({
        message: "No User Found",
      });
    } else {
      const validation = await bcrypt.compare(
        oldPassword,
        currentUser.password
      );
      if (validation) {
        bcrypt.hash(newPassword, saltRounds, function (err, hash) {
          currentUser.password = hash;
          currentUser.__v += 1;
          // console.log("Version is-:", currentUser.__v);
          currentUser.save();
        });
        return res.status(200).json({
          message: "Your password Changed Sucessfully",
        });
      } else {
        return res.status(300).json({
          message:
            "Your Verification is failed please retry with correct password",
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

//posting users complain-:
module.exports.createComplain = async (req, res) => {
  try {
    const { type, desc, pref_date } = req.body;
    if (!type || !desc || !pref_date) {
      return res.status(501).json({
        message: "fields cannot be empty",
      });
    }
    let userRoom = req.user.room;
    var date = moment();
    var currentDate = date.format("D/MM/YYYY");
    var dt = new Date();
    var ct = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    let newComplain = await Complain.create({
      room: userRoom,
      type,
      comp_date: currentDate,
      pref_resolution_date: pref_date,
      comp_time: ct,
      desc,
      user: req.user._id,
    });
    let currentRoom = await Room.findOne({ _id: userRoom });
    if (!currentRoom) {
      return res.status(302).json({
        message:
          "You cannot Post Complain, please Get Room Assigned and try again",
      });
    }
    let newNotify = await Notification.create({
      userName: req.user.name,
      number: currentRoom.number,
      segment: currentRoom.segment,
      read: false,
      desc: type,
      ntype: "Complain",
      compid: newComplain._id,
    });
    return res.status(200).json({
      message: "Complain register sucessfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal Server error",
    });
  }
};

//get Complain resprective to room-:
module.exports.getComplain = async (req, res) => {
  try {
    Complain.find({
      room: req.user.room,
    })
      .populate("user")
      .populate("room")
      .exec(async (err, comp) => {
        // console.log("comp",comp);
        return res.status(200).json({
          message: "Complain Fetched",
          complains: comp,
        });
      });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal Server error",
    });
  }
};
//complain solved update-:
module.exports.updateComplain = async (req, res) => {
  try {
    const { status } = req.body;
    const compId = req.params.id;
    let currentComplain = await Complain.findOne({ _id: compId });
    // console.log(currentComplain);
    if (!currentComplain) {
      return res.status(301).json({
        message: " Please enter a valid complain id",
      });
    } else {
      // console.log(req.user.id);
      // console.log(currentComplain.user);
      if (!(currentComplain.user == req.user.id)) {
        return res.status(422).json({
          message: "You are not authorized to update this complain",
        });
      }
      if (currentComplain.user_response.status === "Resolved") {
        // console.log("Abe bsdc pehle hi resolve ho chuka hai");
        return res.status(302).json({
          message: "You have already resolved your complain!!",
        });
      } else {
        // console.log("Authorized");
        currentComplain.user_response.user = req.user._id;
        currentComplain.user_response.status = status;
        currentComplain.save();
        return res.status(200).json({
          message: "Your response has been saved",
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

//delete the resolved complain-:
module.exports.deleteComplain = async (req, res) => {
  try {
    let cid = req.params.id;
    let currentComp = await Complain.findById(cid);

    if (!currentComp) {
      return res.status(301).json({
        message: "Unable to delete complain",
      });
    }
    if (currentComp.user == req.user.id) {
      currentComp.remove();
      return res.status(200).json({
        message: "Complain Deleted Sucessfully",
      });
    } else {
      return res.status(422).json({
        message: "you are not authorized to delete this complain",
      });
    }
  } catch (error) {
    console.log("on line 219", error);
    return res.status(501).json({
      message: "Internal Server error",
    });
  }
};

//fetching user detials-:
// module.exports.getDetails = async (req, res) => {
//   try {
//     User.findOne({ _id: req.user._id })
//       .populate({
//         path: "room",
//         populate: {
//           path: "warden",
//         },
//       })
//       .exec(async (err, results) => {
//         if (err) {
//           console.log(err);
//           return res.status(301).json({
//             message: "No User found||NO Room Alloted",
//           });
//         } else {
//           //   console.log(results);
//           return res.status(200).json({
//             message: "user details",
//             data: results,
//           });
//         }
//       });
//   } catch (error) {
//     console.log(error);
//     return res.status(501).json({
//       message: "Internal Server error",
//     });
//   }
// };

// module.exports.getRoommate = async (req, res) => {
//   try {
//     if (req.user.room === null) {
//       return res.status(301).json({
//         message: "Room is not yet assigned to the user",
//       });
//     }
//     // console.log(req.user);
//     let currentRoom = await Room.findOne({ _id: req.user.room });
//     let roomMate = null;
//     // console.log("room-:",currentRoom.user1);
//     // console.log("User-:",req.user.id);
//     // console.log("room-:",currentRoom.user2);
//     if (req.user.id !== currentRoom.user1 && req.user.id == currentRoom.user2) {
//       roomMate = "user1";
//     } else if (
//       req.user.id !== currentRoom.user2 &&
//       req.user.id == currentRoom.user1
//     ) {
//       roomMate = "user2";
//     }
//     // console.log(roomMate);
//     User.findOne({ _id: req.user._id })
//       .populate({
//         path: "room",
//         populate: {
//           path: roomMate,
//         },
//       })
//       .exec(async (err, results) => {
//         if (err) {
//           console.log(err);
//           return res.status(301).json({
//             message: "No User found||NO Room Alloted",
//           });
//         } else {
//           //   console.log(results);
//           return res.status(200).json({
//             message: "user details",
//             data: results,
//             mate: roomMate,
//           });
//         }
//       });
//   } catch (error) {
//     console.log(error);
//     return res.status(501).json({
//       message: "Internal Server error",
//     });
//   }
// };

//api for handling getting user details-:
const getRoomMateId = (room, cid) => {
  if (room.user1 == cid) {
    // console.log("User2 is roomMate");
    return room.user2;
  } else if (room.user2 == cid) {
    // console.log("User1 is roomMate");
    return room.user1;
  }
};
module.exports.getFullDetails = async (req, res) => {
  try {
    User.findOne({ _id: req.user._id })
      .populate({
        path: "room",
        populate: {
          path: "warden",
        },
      })
      .select("-password")
      .exec(async (err, results) => {
        if (err) {
          console.log(err);
          return res.status(301).json({
            message: "No User found||No Room Alloted",
          });
        } else {
          // console.log("Results-:",results);
          if (
            results.room.personCount === 1 &&
            results.room.type === "Single"
          ) {
            return res.status(200).json({
              message: "Single Room Alloted",
              data: results,
              roomMate: "Single Room Allocated",
              assigned: false,
            });
          }
          if (results.room.personCount === 1) {
            return res.status(200).json({
              message: "Room is Not Assigned Yet",
              data: results,
              roomMate: "Room Mate is not assigned yet",
              assigned: false,
            });
          } else {
            const roomMateId = getRoomMateId(results.room, req.user.id);
            let RoomMate = await User.findById(roomMateId).select("-password");
            // console.log("Room Mate Details-:",RoomMate);
            // console.log(roomMateId);
            return res.status(200).json({
              message: "All Details",
              data: results,
              roomMate: RoomMate,
              assigned: true,
            });
          }
        }
      });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal Server error",
    });
  }
};

module.exports.logout = async (req, res) => {
  try {
    // console.log("In logout");
    req.logout(async (err, users) => {
      if (err) {
        return res.status(501).json({
          message: "Failed to logout",
        });
      } else {
        res.clearCookie("jwt");
        res.clearCookie("user");
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

//request creation-:
module.exports.roomChangeRequest = async (req, res) => {
  try {
    const { changeType } = req.body;
    // console.log("Ayya toh", changeType);
    if (changeType === "New") {
      const { reason, number, floor, segment, type, count } = req.body;
      let currentUser = req.user;
      console.log(type, count);
      if (
        !reason ||
        !changeType ||
        !number ||
        !floor ||
        !segment ||
        currentUser.room === null
      ) {
        return res.status(422).json({
          message: "Fileds cannot be Empty",
        });
      }
      let newReqRoom = await Room.findOne({
        number,
        floor,
        segment,
        status: "Available",
      });
      if (!newReqRoom || newReqRoom.personCount === 2) {
        return res.status(301).json({
          message: "please enter an available room number!",
        });
      }
      if (
        (newReqRoom.personCount > 0 && type === "Single") ||
        (newReqRoom.personCount > 0 && type === "Double" && count === 2)
      ) {
        return res.status(301).json({
          message: "Room is not available !",
        });
      }
      if (type === "Double") {
        let newRequest = await Change.create({
          reason,
          changeType,
          requestBy: currentUser._id,
          currentRoom: currentUser.room,
          allocationType: type,
          shiftCount: count,
          newDetails: {
            rno: number,
            floor: floor,
            segment: segment,
          },
        });
        if (!newRequest) {
          return res.status(302).json({
            message: "Unable to create a request",
          });
        } else {
          return res.status(200).json({
            message: "Request Created Successfully",
          });
        }
      } else if (type === "Single") {
        // let newRoom = await Room.findOne({
        //   number,
        //   segment,
        //   floor,
        //   status: "Available",
        //   personCount: 0,
        // });
        if (newReqRoom.user1 !== null || newReqRoom.user2 !== null) {
          return res.status(301).json({
            message: "please enter an available room details😪",
          });
        }
        let singleRoomReq = await Change.create({
          reason,
          changeType,
          requestBy: req.user.id,
          currentRoom: req.user.room,
          allocationType: type,
          shiftCount: count,
          newDetails: {
            rno: number,
            segment,
            floor,
          },
        });
        if (!singleRoomReq) {
          return res.status(301).json({
            message: "Error  please try again😢!",
          });
        }

        return res.status(200).json({
          message:
            "You request has been submitted,, wait for admin to verify!😀",
        });
      }
    } else if (changeType === "Swap") {
      const { reg_no, reason } = req.body;
      const currentUser = req.user;
      const currentRoom = req.user.room;
      const withUser = await User.findOne({ reg_no });
      if (!withUser) {
        return res.status(301).json({
          message: "Enter a valid registration number",
        });
      } else if (withUser.room === null) {
        return res.status(301).json({
          message: "No Room is alloted to this user",
        });
      } else {
        const newRequest = await Change.create({
          reason,
          changeType,
          currentRoom,
          requestBy: currentUser,
          swapRoom: withUser.room,
          newDetails: {
            withUser: withUser._id,
          },
        });
        if (!newRequest) {
          return res.status(301).json({
            message: "Unable to create a request please try again",
          });
        }
        console.log(newRequest);
        return res.status(200).json({
          message: "Request is placed, wait for Admin to approve",
        });
      }
    } else {
      /*
    else if (changeType === "Single") {
      const { reason, changeType, number, segment, floor } = req.body;

      if (!reason || !changeType || !number || !floor || !segment) {
        return res.status(422).json({
          message: "Fileds cannot be Empty",
        });
      }

      let newRoom = await Room.findOne({
        number,
        segment,
        floor,
        status: "Available",
        personCount: 0,
      });
      if (!newRoom || newRoom.user1 !== null || newRoom.user2 !== null) {
        return res.status(301).json({
          message: "please enter an available room details😪",
        });
      }
      let singleRoomReq = await Change.create({
        reason,
        changeType,
        requestBy: req.user.id,
        currentRoom: req.user.room,
        newDetails: {
          rno: number,
          segment,
          floor,
        },
      });
      if (!singleRoomReq) {
        return res.status(301).json({
          message: "Error  please try again😢!",
        });
      }

      return res.status(200).json({
        message: "You request has been submitted,, wait for admin to verify!😀",
      });
    }
    */
      console.log("else me aa gya");
      return res.status(301).json({
        message: "Inside Else",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};

//get-request-to-roommate-:
module.exports.sendRequest = async (req, res) => {
  try {
    let currentUser = req.user;
    if (currentUser.room === null) {
      return res.status(301).json({
        message: "User is not allocated any room yet",
      });
    }
    Change.find({
      currentRoom: currentUser.room,
    })
      .populate("swapRoom")
      .exec((err, currentRequest) => {
        if (err) {
          console.log(err);
        }
        if (!currentRequest) {
          return res.status(302).json({
            message: "Request Not found",
            request: 0,
          });
        }
        Change.find({
          swapRoom: currentUser.room,
        })
          .populate("swapRoom")
          .exec((err, results) => {
            if (err) {
              console.log(err);
            }
            if (results.length !== 0) {
              results.map((sw, i) => {
                currentRequest.push(sw);
              });
            }
            return res.status(200).json({
              message: "Your Request Array is",
              request: currentRequest,
            });
          });
      });
  } catch (error) {
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};

module.exports.modifyRequest = async (req, res) => {
  try {
    const { status, desc } = req.body;
    if (!status || !desc) {
      return res.status(301).json({
        message: "Fields cannot be empty",
      });
    }
    const reqId = req.params.id;
    const currentRequest = await Change.findById(reqId);
    if (!currentRequest) {
      return res.status(301).json({
        message: "Cannot find request",
      });
    }
    if (currentRequest.requestBy == req.user.id) {
      return res.status(301).json({
        message: "You cannot approve your own request",
      });
    }
    let alreadyRespond = false;
    if (currentRequest.studentApproval.length !== 0) {
      currentRequest.studentApproval.map((cs, i) => {
        if (JSON.stringify(cs.by) == JSON.stringify(req.user.id)) {
          alreadyRespond = true;
          return;
        } else {
          alreadyRespond = false;
        }
      });
    }
    if (alreadyRespond) {
      return res.status(301).json({
        message: "you have already entered your response",
      });
    } else {
      const newObj = {
        status: status,
        desc: desc,
        by: req.user.id,
      };
      currentRequest.studentApproval.push(newObj);
      currentRequest.save();
      return res.status(200).json({
        message: `Room Change is ${status} by You`,
      });
    }

    // } else if (currentRequest.changeType === "Swap") {
    // console.log("Hello");
    // }
  } catch (error) {
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};

module.exports.deleteRequest = async (req, res) => {
  try {
    const reqId = req.params.id;
    const currentRequest = await Change.findById(reqId);
    if (!currentRequest) {
      return res.status(301).json({
        message: "Unable To Delete",
      });
    }
    if (currentRequest.requestBy == req.user.id) {
      currentRequest.remove();
      return res.status(200).json({
        message: "Deleted Sucessfully",
      });
    } else {
      return res.status(422).json({
        message: "You Are not authorized to delete this request",
      });
    }
  } catch (error) {
    return res.status(501).json({
      message: "Internal server error",
    });
  }
};

//apply for leave
module.exports.applyLeave = async (req, res) => {
  try {
    const { reason, from, to } = req.body;
    if (!reason || !from || !to) {
      return res.status(301).json({
        message: "Fields cannot be empty",
      });
    }
    const uid = req.user.id;
    // console.log("U-:", uid);
    const userRoom = await Room.findById(req.user.room);
    if (!userRoom) {
      return res.status(301).json({
        message: "You Cannot apply for leave",
      });
    }
    const wid = userRoom.warden;
    let allLeave = await Leave.find({});
    let no = `smit000${allLeave.length + 1}`;
    const newLeave = await Leave.create({
      leaveNo: no,
      reason,
      from,
      to,
      user: uid,
      warden: wid,
    });
    if (!newLeave) {
      return res.status(301).json({
        message: "Unable to apply for leave",
      });
    }
    //send message to parents with the link-: http://localhost:3000/leave/:leave_id-:
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const twNumber = process.env.TWN_NO;
    const client = require("twilio")(accountSid, authToken);
    const msgBody = `Sikkim Manipal Institute Of Technology
    Your ward ${req.user.name} has request for leave, Kindly check in/verify and provide your response on https://smit-hms.vercel.app/leave/${newLeave.id}`;
    client.messages
      .create({
        body: msgBody,
        from: twNumber,
        to: "+919939329441",
      })
      .then((mes) => {
        console.log(mes);
        return res.status(200).json({
          message:
            "Leave applied and link with message is send to your parents contact number",
        });
      });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal Server Error",
    });
  }
};
//get-leave

module.exports.getLeave = async (req, res) => {
  try {
    // console.log(req.user.id);
    Leave.find({ user: req.user.id })
      .populate("user")
      .exec((err, allLeave) => {
        // console.log(allLeave);
        if (!allLeave || err) {
          return res.status(301).json({
            message: "No Leave Found",
            data: [],
          });
        }
        // console.log(allLeave);
        return res.status(200).json({
          message: "Got Leave",
          data: allLeave,
        });
      });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal Server Error",
    });
  }
};

//delete-Leave
module.exports.deleteLeave = async (req, res) => {
  try {
    const currentLeave = await Leave.findById(req.params.id);
    if (!currentLeave) {
      return res.status(301).json({
        message: "Leave with this id does not exist",
      });
    }
    if (JSON.stringify(currentLeave.user) !== JSON.stringify(req.user.id)) {
      return res.status(422).json({
        message: "Unauthorized Access",
      });
    } else {
      currentLeave.remove();
      return res.status(200).json({
        message: "Leave Removed successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: "Internal Server Error",
    });
  }
};
