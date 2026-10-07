const express=require("express");
const mongoose=require("mongoose");
const app=express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(__dirname));

mongoose.connect("mongodb://user_44zxcy8qj:p44zxcy8qj@db01.dbhost.dev:5050/db_44zxcy8qj")
.then(()=>console.log("MongoDB connected"))
.catch(e=>console.log(e.message));

const Member=mongoose.model("Member",new mongoose.Schema({
 memberId:{type:String,unique:true},name:String,clubName:String,year:Number,
 role:String,points:Number,interests:String,status:String
}));

const Buddy=mongoose.model("Buddy",new mongoose.Schema({
 buddyId:{type:String,unique:true},name:String,destination:String,age:Number,
 budget:Number,tripDuration:Number,interests:String,status:String
}));

app.get("/",(req,res)=>res.sendFile(__dirname+"/index.html"));

// CAMPUS CLUB CRUD

app.post("/members",async(req,res)=>{
 try{await Member.create(req.body);res.send("Member added successfully");}
 catch(e){res.send(e.message);}
});

app.get("/members",async(req,res)=>{
 res.json(await Member.find().sort({points:-1}));
});

app.put("/members/:id",async(req,res)=>{
 res.json(await Member.findOneAndUpdate(
  {memberId:req.params.id},req.body,{new:true}
 ));
});

app.delete("/members/:id",async(req,res)=>{
 await Member.findOneAndDelete({memberId:req.params.id});
 res.send("Member deleted");
});

app.get("/members/search/:id",async(req,res)=>{
 res.json(await Member.findOne(
  {memberId:req.params.id},"name clubName role points"
 ));
});

app.get("/members/filter/:club/:points",async(req,res)=>{
 res.json(await Member.find({
  clubName:req.params.club,points:{$gt:req.params.points}
 }));
});

app.get("/members/range/:min/:max",async(req,res)=>{
 res.json(await Member.find({
  points:{$gte:req.params.min,$lte:req.params.max}
 }));
});

app.patch("/members/points/:club/:points",async(req,res)=>{
 await Member.updateMany(
  {clubName:req.params.club},
  {$inc:{points:Number(req.params.points)}}
 );
 res.send("Points updated");
});

// TRAVEL BUDDY CRUD

app.post("/buddies",async(req,res)=>{
 try{await Buddy.create(req.body);res.send("Travel Buddy added");}
 catch(e){res.send(e.message);}
});

app.get("/buddies",async(req,res)=>{
 res.json(await Buddy.find().sort({budget:-1}));
});

app.put("/buddies/:id",async(req,res)=>{
 res.json(await Buddy.findOneAndUpdate(
  {buddyId:req.params.id},req.body,{new:true}
 ));
});

app.delete("/buddies/:id",async(req,res)=>{
 await Buddy.findOneAndDelete({buddyId:req.params.id});
 res.send("Travel Buddy deleted");
});

app.get("/buddies/search/:id",async(req,res)=>{
 res.json(await Buddy.findOne(
  {buddyId:req.params.id},"name destination budget tripDuration"
 ));
});

app.get("/buddies/filter/:place/:budget",async(req,res)=>{
 res.json(await Buddy.find({
  destination:req.params.place,budget:{$gt:req.params.budget}
 }));
});

app.get("/buddies/range/:min/:max",async(req,res)=>{
 res.json(await Buddy.find({
  budget:{$gte:req.params.min,$lte:req.params.max}
 }));
});

app.patch("/buddies/budget/:place/:amount",async(req,res)=>{
 await Buddy.updateMany(
  {destination:req.params.place},
  {$inc:{budget:Number(req.params.amount)}}
 );
 res.send("Budget updated");
});

app.listen(3000,()=>console.log("Server running"));