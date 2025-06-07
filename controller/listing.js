// controller/listing.js
const express=require("express");
const router=express.Router();
const wrapAsync= require('../utils/wrap.js');
const{listingSchema, reviewSchema}=require('../schema.js');
const ExpressError = require("../utils/ExpressError.js");
const listing=require("../models/listing.js");
const review=require("../models/review.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controller/listing.js");

const geocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAP_TOKEN;
const geocoder = geocoding({ accessToken: mapboxToken });


//index route
module.exports.getAllListings =  async (req, res) => {
    const alllistings=await listing.find({})
        
        res.render("listings/index.ejs", {alllistings});
    
};
//new listing route
module.exports.newListing = (req, res) => {
    // Check if user is logged in
    res.render("listings/new.ejs");
};
//create listing route
module.exports.index=async(req, res) => {
    let response=await geocoder.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    }).send();
    
;

    




  let url=req.file.path;
  let filename=req.file.filename;
listingSchema.validate(req.body);

   
    const newlisting = new listing(req.body.listing);
     newlisting.owner = req.user._id;
     newlisting.image={url,filename};
    newlisting.geometry = response.body.features[0].geometry;
   let savedListing= await newlisting.save();
   console.log(savedListing);
   

    req.flash("success", "New listing created");
    res.redirect("/listings");
    
   };
//edit listing route
module.exports.editListing =  async (req, res) => {
    let { id } = req.params;
    const listingl = await listing.findById(id);
if(!listingl) {
 
    req.flash("error", "Listing not found");
    return res.redirect("/listings");};
   let original= listingl.image.url;
   original.replace("/upload","/upload/h_300,w_250");
       res.render("listings/edit.ejs", { listingl ,original});
     //next();
  };
//update listing route
module.exports.updateListing = async (req, res) => {
  
    let { id } = req.params;
   
   let listingl= await listing.findByIdAndUpdate(id, { ...req.body.listing });
   if (typeof req.file !== "undefined") {
    let url=req.file.path;
  let filename=req.file.filename;
  listingl.image={url,filename};
    await listingl.save();}
    req.flash("success", "Listing updated");
    res.redirect("/listings");
   };
  
//delete route
module.exports.deleteListing =  async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
     // Redirect
    res.redirect("/listings");
     
  };
//show route
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listingl = await listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
    if (!listingl) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    //console.log(listingl);
    res.render("listings/show.ejs", { listingl });
  };