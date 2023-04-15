require('dotenv').config();
const express=require('express');
const port=5591||process.env.PORT;
//required files-:
const cors=require('cors');
//using express-session
const session=require('express-session');
//passport
const passport=require('passport');
//jwt-strategy
const JwtStrategy=require('./config/passport-jwt-strategy');
//warden-jwt
//db connection
const db=require('./config/mongoose');

//using cookie-parser
var cookieParser = require('cookie-parser')



const app=express();

app.use(cors());
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret: `${process.env.SECRET}`,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/',require('./routes'))
if (process.env.MODE == "production") {
  //serving all the statick files like main.js,main.css-:
  app.use(express.static(path.resolve(__dirname, "client", "build")));

  //express will serve up the index.html file if routes doesnot match-:
  app.get("*", (req, res) => {
    // console.log("Inside me");
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}


app.listen(port,()=>{
    console.log(`Server is up and running click to visit http://localhost:${port}/`);
})

//adding rooms using excel sheet
// const roomFile=require('./roomFile');
//adding warden details using excel sheet
// const wardenFile=require('./wardenFIle');
//warden allocation to rooms
// wardenFile.AllocateWarden();