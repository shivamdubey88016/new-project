const express= require('express');
const app= express();
const mongoose= require('mongoose');
const path= require('path');
const listingSchema=require('./schema.js');
//setting up ejs-mate
const ejsmate= require('ejs-mate');
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, '/public')));
const wrapAsync= require('./utils/wrap.js');
const ExpressError = require("./utils/ExpressError.js");
//setting up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
const listing=require("./models/listing.js");
const review=require("./models/review.js");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
//const{ reviewSchema}=require('./schema.js');



//mongoose conection
const mongoUrl='mongodb://127.0.0.1/wanderlust';
async function main() {
    await mongoose.connect(mongoUrl);}
main().then(() => {console.log("connected to database");})
.catch(err => {console.log(err);});
/*validation of review
const validateReview=(req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };*/

app.get('/', (req, res) => {
    res.send('Hello World');

}
);

app.get('/listings', async (req, res) => {
    const alllistings=await listing.find({})
        
        res.render("listings/index.ejs", {alllistings});
    
});


 //new listing route
 app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
   });
   // create listing route
   app.post("/listings",wrapAsync(async(req, res) => {
listingSchema.validate(req.body);
console.log(req.body);
   
    const newlisting = new listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
    
   }));

     
    

   
  
  
 
    
   //edit listing route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listingl = await listing.findById(id);
    res.render("listings/edit.ejs", { listingl });
  });

  //update listing route
  app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
  });
  //delete route
  app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
  });
//show route
 app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listingl = await listing.findById(id).populate("reviews");
    
    res.render("listings/show.ejs", { listingl });
  });

  //reviews route
  app.post("/listings/:id/reviews", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listingl = await listing.findById(id);

  // Extract data directly from req.body
  const { rating, comment,name } = req.body;

  const review1 = new review({ rating, comment,name }); 
  listingl.reviews.push(review1); 
  await review1.save(); 
  await listingl.save();

  res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id/reviews/:reviewId", async (req, res) => {
    const { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`); 

   });

 /*app.use((err, req, res, next) => {
    //let { statusCode , message  } = err;
  // res.render("error.ejs");
 // });*/
  //our middleware
  
   
  app.listen(3000, () =>{
    console.log("server is running on port 3000");
}
);
 app.all("",(req, res,next) => {
    next(new ExpressError("Page not found", 404));
  });

  