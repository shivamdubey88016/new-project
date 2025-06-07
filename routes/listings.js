const express=require("express");
const router=express.Router();
const wrapAsync= require('../utils/wrap.js');
const{listingSchema, reviewSchema}=require('../schema.js');
const ExpressError = require("../utils/ExpressError.js");
const listing=require("../models/listing.js");
const review=require("../models/review.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const { cloudinary, storage } = require('../cloudConfig.js');

//multer
const multer  = require('multer')
const upload = multer({ storage})

router.route("/").get(listingController.getAllListings).post(isLoggedIn, upload.single('listing[image]'), listingController.index);
//new listing route

router.get("/new",isLoggedIn, listingController.newListing);

router.route("/:id").put( upload.single('listing[image]'), listingController.updateListing).delete(listingController.deleteListing).get(isLoggedIn, listingController.showListing);
    
   //edit listing route
router.get("/:id/edit",listingController.editListing);
 module.exports=router;