const express=require("express");
const router=express.Router({mergeParams:true});
const  wrapAsync= require('../utils/wrap.js');
const{listingSchema, reviewSchema}=require('../schema.js');
const review=require("../models/review.js");
const listing=require("../models/listing.js");
const { isLoggedIn, isOwner ,isReviewOwner} = require("../middleware.js");




//reviews route
module.exports.createReview =wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listingl = await listing.findById(id);

  // Extract data directly from req.body
  const { rating, comment,name } = req.body;

  const review1 = new review({ rating, comment,name }); 
  review1.author = req.user._id; // Set the author to the current user
  listingl.reviews.push(review1); 
  await review1.save(); 
  await listingl.save();
req.flash("success", "New review created");
  res.redirect(`/listings/${id}`);
});
//delete review route
module.exports.deleteReview =  async (req, res) => {
    const { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
     // Redirect to the listing 
    res.redirect(`/listings/${id}`); 

   };