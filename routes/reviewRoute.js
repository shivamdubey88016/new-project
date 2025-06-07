const express=require("express");
const router=express.Router({mergeParams:true});
const  wrapAsync= require('../utils/wrap.js');
const{listingSchema, reviewSchema}=require('../schema.js');
const review=require("../models/review.js");
const listing=require("../models/listing.js");
const { isLoggedIn, isOwner ,isReviewOwner} = require("../middleware.js");
const reviewController = require("../controller/reviews.js");






  //reviews route
  router.post("/",  isLoggedIn,reviewController.createReview);

router.delete("/:reviewId",reviewController.deleteReview);
   module.exports=router;