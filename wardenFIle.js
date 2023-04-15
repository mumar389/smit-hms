const parser = require("simple-excel-to-json");
const json2xls = require("json2xls");
const fs = require("fs");
const documents = parser.parseXls2Json("../Sheets/Wardens.xlsx");
const Warden=require('./models/warden');
const Room=require("./models/room");
module.exports.CreateWarden=async()=>{
documents[0].map((d)=>{
    Warden.create({
        name:d.Name,
        floor:d.Floor,
        contact:d.Contact,
        segment1:d.Segment1,
        segment2:d.Segment2,
        segment3:d.Segment3
    })
    // console.log(d);
})
}
//warden allocation to room
module.exports.AllocateWarden=async()=>{
    //         if(r.warden===null){
    //         if(r.floor===1 && w.floor===1){
    //         if(r.segment===w.segment1){
    //             r.warden=w._id;
    //             r.save();
    //         }
    //         if(r.segment===w.segment2){
    //             r.warden=w._id;
    //             r.save();
    //         }
    //         if(r.segment===w.segment3){
    //             r.warden=w._id;
    //             r.save();
    //         }
    //     }
    // }
    let allRooms=await Room.find({floor:7});
    let allWardens=await Warden.find({floor:7})
          allRooms.map((r)=>{
            allWardens.map((w)=>{
                if(r.segment===w.segment1){
                    r.warden=w._id;
                    r.save();
                }
                if(r.segment===w.segment2){
                    r.warden=w._id;
                    r.save();
                }
                if(r.segment===w.segment3){
                    r.warden=w._id;
                    r.save();
                }
            })
        
        })
}