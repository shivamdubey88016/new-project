if (process.env.NODE_ENV !== "production") {

  require('dotenv').config();
}

const express= require('express');
const app= express();
const mongoose= require('mongoose');
const path= require('path');
//const listingSchema=require('./schema.js');
//setting up ejs-mate
const ejsmate= require('ejs-mate');
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, '/public')));
const session= require('express-session');
const MongoStore = require('connect-mongo');
const flash= require('connect-flash');

//setting up multer for file uploads

//setting up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
const listing=require("./models/listing.js");
const review=require("./models/review.js");

const methodOverride = require("method-override"); 
app.use(methodOverride("_method"));
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const listingRoutes=require('./routes/listings.js');
const reviewRoutes=require('./routes/reviewRoute.js');
const userRoutes=require('./routes/user.js');

//mongoose conection
//const mongoUrl='mongodb://127.0.0.1/wanderlust';
const mongoUrl=process.env.MONGO_ATLAS
async function main() {
    await mongoose.connect(mongoUrl);}
main().then(() => {console.log("connected to database");})
.catch(err => {console.log(err);});

//setting up the session store
 const store=MongoStore.create({

    mongoUrl,
    crypto: {
      secret:process.env.SECRET1,},
      touchAfter: 24 * 3600, // time period in seconds

    });
    store.on("error", function(e) {

        console.log("session store error", e);

    });

//session middleware

const sessionOption={
   store:store,
    
  secret: process.env.SECRET2,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        maxAge:1000*60*60*24*7,
        expires:new Date(Date.now()+1000*60*60*24*7)
    },
  };

    app.use(session(sessionOption));
    app.use(flash());
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



  app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
  }); 


    
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);
 
  

     
    

   
  
  
 
    
   
 

 


  
   
  app.listen(3000, () =>{
    console.log("server is running on port 3000");
}
);
 
  