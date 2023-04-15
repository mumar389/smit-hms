const mongoose=require('mongoose');

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGOURI)

const db=mongoose.connection;

db.on('error',console.error.bind('console','errror in connection with db'));
db.once('open',(err)=>{
    console.log(`Connected to db sucessfully`);
})

module.exports=db;