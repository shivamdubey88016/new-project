const express= require('express');
const app= express();
const mongoose= require('mongoose');
const path= require('path');
//setting up ejs-mate
const ejsmate= require('ejs-mate');
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, '/public')));

//setting up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
const listing=require("./models/listing.js");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.listen(3000, () =>{
    console.log("server is running on port 3000");
}
);
//mongoose conection
const mongoUrl='mongodb://127.0.0.1/wanderlust';
async function main() {
    await mongoose.connect(mongoUrl);}
main().then(() => {console.log("connected to database");})
.catch(err => {console.log(err);});



app.get('/', (req, res) => {
    res.send('Hello World');

}
);
app.get('/listings', async (req, res) => {
    const alllistings=await listing.find({})
        console.log(res);
        res.render("listings/index.ejs", {alllistings});
    
});

 //new listing route
 app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
   });
   // create listing route
   app.post("/listings", async (req, res) => {
    const newlisting = new listing(req.body);
    await newlisting.save();
    res.redirect("/listings");
   });
  

   
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
    res.redirect(`/listings`);
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
    const listingl = await listing.findById(id);
    res.render("listings/show.ejs", { listingl });
  }); 
  
 