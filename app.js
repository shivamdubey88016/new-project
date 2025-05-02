const express= require('express');
const app= express();
const mongoose= require('mongoose');
const listing=require("./models/listing.js");
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

app.get("/testlisting",async (req,res)=>
{ let samplelisting=new listing({
    title:"my home",
    description:"by the beach",
    price:2345,
    location:"india",
    country:"india",
});
 await samplelisting.save();
 res.send("successful");

});

app.get('/', (req, res) => {
    res.send('Hello World');
}
);

