const mongoose=require('mongoose');

const complainSchema=new mongoose.Schema({
    room:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Room',
        default:null
    },
    type:{
        type:String,
        required:true
    },
    comp_date:{
        type:String,
        required:true
    },
    pref_resolution_date:{ 
        type:String,
        required:true
    },
    comp_time:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"Not Resolved"
    },
    resolution_date:{
        type:String,
        default:null
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    user_response:{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            default:null
        },
        status:{
            type:String,
            default:"Not Resolved"
        }
    }    

},
{
    timestamps:true
});

const Complain=mongoose.model('Complain',complainSchema);
module.exports=Complain;