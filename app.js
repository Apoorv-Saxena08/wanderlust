const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method")); 
main()
.then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req,res)=>{
    res.send("Hi i am root");
})

app.listen(8080 , ()=>{
    console.log("Server is starting at port 8080");
})

// app.get("/testListing" , async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My Home",
//         description:"By the beach",
//         price:1200,
//         location:"Cp,Delhi",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("samplle was saved");
//     res.send("successful");
// });

//Index route
app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}
);


//Create : new and create route
// new -> GET at /listings/new -> form milega hen on submitting..
//Create request -> POST at /listings

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//create route 
app.post("/listings",async (req,res)=>{
    //let {title,description,image,price,country,location} = req.body; 
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})

//Update  : Edit route And Update route
//Edit : GET @ /listings/:id/edit ->edit form _> submit
//Update : PUT @ /listings/:id

//edit route 
app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//update route
app.put("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//Delete route - DELETE @ /listings/:id
app.delete("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

//Show route : Read : hr id ka sara data dikhayenge
app.get("/listings/:id" , async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

