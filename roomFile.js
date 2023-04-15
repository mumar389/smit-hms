const parser = require("simple-excel-to-json");
const json2xls = require("json2xls");
const fs = require("fs");
const documents = parser.parseXls2Json("../Sheets/Rooms.xlsx");

const Room=require('./models/room')

documents[0].map((doc)=>{
    Room.create({
        floor:doc.floor,
        segment:doc.segment,
        number:doc.number
    })
})
