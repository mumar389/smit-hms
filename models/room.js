const mongoose=require('mongoose');

const roomSchema=new mongoose.Schema({
    number:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        //required:true,
        default:"Available"
    },
    user1:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null,
        // required:true
    },
    user2:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null,
        // required:true
    },
    segment:{
        type:String,
        required:true
    },
    floor:{
        type:Number,
        required:true
    },
    personCount:{
        type:Number,
        default:0,
    },
    warden:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Warden',
        default:null,
        // required:true
    },
    hostelNo:{
        type:Number,
        default:1
    },
    type:{
        type:String,
        default:'Double'
    }
    
},{
    timestamps:true
});

const Room=mongoose.model('Room',roomSchema);
module.exports=Room;