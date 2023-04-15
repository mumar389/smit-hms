const mongoose=require('mongoose');

const adminSchema=new mongoose.Schema({
name:{
    type:String,
    required:true
},
username:{
    type:String,
    required:true
},      
password:{
    type:String,
    required:true
},
desg:{
    type:String,
    required:true
}
},{
    timestamps:true
});

const Admin=mongoose.model('Admin',adminSchema);
module.exports=Admin;