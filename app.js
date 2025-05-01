const express= require('express');
const app= express();
const mongoose= require('mongoose');
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

