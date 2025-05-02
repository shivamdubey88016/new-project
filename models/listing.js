const mongoose= require('mongoose');
const schema=mongoose.Schema;
const listingschema=new schema({
    title:{type: String ,
        required:true,
    }
    ,
    description:String,
    image:{type: String ,
        default:"https://th.bing.com/th/id/OIP.jHvTOSF7924Ah63W7mozxQHaEo?rs=1&pid=ImgDetMain"
     , set:(v)=>v===""? "https://th.bing.com/th/id/OIP.jHvTOSF7924Ah63W7mozxQHaEo?rs=1&pid=ImgDetMain": v,  
    },
    price:Number,
    location:String,
    country:String,
});






const listing=mongoose.model("listing",listingschema);
module.exports=listing;

