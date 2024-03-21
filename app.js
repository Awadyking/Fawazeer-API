const express = require("express")
const cors = require("cors")
const app = express();
const mongoose = require("mongoose")
app.use(cors());
app.use(express.json());
const Port = 4500 ; 
const DB_link =  "mongodb+srv://fawazeer:Fawazeer0505@fawazeer.piglvtl.mongodb.net/?retryWrites=true&w=majority&appName=Fawazeer"
mongoose.connect(DB_link)
.then(() => {console.log("Data Base Connected")})
.catch((error) => {console.log("This an Error" + error)})

//API

const Users = require("./DB/Users")
const Question = require("./DB/Question")
//Add Users

app.post("/Users/:pass" , async(Req , Res) =>{
if(Req.params.pass == "20212223"){
const newUser = new Users()
let Code = Req.body._id
let Name = Req.body.Name
let Answer = Req.body.Answer
let Status = Req.body.Status
let LoginTime = Req.body.LoginTime
let LogoutTime = Req.body.LogoutTime

newUser._id = Code
newUser.Name = Name
newUser.Answer = Answer
newUser.Status = Status
newUser.LoginTime = LoginTime
newUser.LogoutTime = LogoutTime
await newUser.save()
Res.send("The data Saved")
}else{
    Res.send("The Password is Wrong!")
}
})

//Editing Users

app.put("/Login" , async(Req , Res) =>{
const Code = Req.body.Code
let Quesfind = await Question.findById(1)
let Data = await Users.findById(Code)
await Users.findByIdAndUpdate(Code , {
    Status : Req.body.Status ,
   LoginTime : Req.body.LoginTime 
});
Res.json( [Data , Quesfind])
})


app.get("/UType" , async(Req ,Res) =>{
Code = Req.body.Code
let User = await Users.findById(Code)
Res.json(User.Type)
})


app.put("/Logout" , async (Req , Res) => {
    const Code = Req.body.Code
    await Users.findByIdAndUpdate(Code , {
        Answer : Req.body.Answer , 
       LogoutTime : Req.body.LogoutTime 
    });
    Res.send("Okay")
})





 async function Timed(){
    let Datenow = Math.trunc( new Date().getTime() / 1000)
    let QuesFind = await Question.findById(1)
    let newQues = new Question()
if(QuesFind.Timer >= Datenow){newQues._id = 3}
}





//Q&A
app.post("/Ques/:pass" , async(Req , Res) =>{
    if(Req.params.pass == "20212223"){
    const newQues = new Question()
    let Quest = Req.body.Ques
    let A = Req.body.A
    let B = Req.body.B
    let C = Req.body.C
    let D = Req.body.D
    let F = Req.body.F
    let True = Req.body.True
    let Type = Req.body.Type
    let Timer = Req.body.Timer
    newQues._id = 1
    newQues.Ques = Quest
    newQues.A = A
    newQues.B = B
    newQues.C = C
    newQues.D = D
    newQues.F = F
    newQues.True = True
    newQues.Type = Type
    newQues.Timer = Timer
    await newQues.save()
    Res.send("The Question Saved")
    setInterval(()=>{Timed()},1000)
    }else{
        Res.send("The Password is Wrong!")
    }
    })

// Reset
app.delete("/reset" , async (Req , Res) =>{
await Question.findByIdAndDelete(1)
Quesfind = await Question.find()
let QuesArr = []
for(Quest of Quesfind){
   QuesArr.push(Quest.Ques)
}
if(QuesArr.length > 2){
await Question.findByIdAndDelete(3)
}
let Alluser = await Users.find()
let Code = "";
for (user of Alluser){
    Code = user._id;
    await  Users.findByIdAndUpdate(Code , {
    Answer : "" ,
    Status : false,
    LoginTime : null ,
    LogoutTime : null
    })
}
Res.send("Deleted Successfully")
})

//Result


app.get("/Result" , async (Req , Res) =>{
let Winners = [] 
let Losers = []
let Allusers = await Users.find()
let Quesfind = await Question.findById(1)
let Code = "";
for(user of Allusers){   
Code = user._id
if(user.Answer == Quesfind.True){Winners.push([user.Name , user.LogoutTime])}
else{Losers.push([user.Name , user.LogoutTime , user.LoginTime])}
}
Res.json({Winners , Losers})
})



app.get("/Ques" , async(Req , Res) => {
 Quesfind = await Question.find()
 let QuesArr = []
for(Quest of Quesfind){
    QuesArr.push(Quest.Ques)
}


Res.json(QuesArr)

})

app.get("/Users" , async(Req , Res) => {
    let Allusers = await Users.find()
    Res.json(Allusers)
})


app.put("/DelUsers/" , async (Req , Res)=>{
let Code = Req.body.Code
let Allusers = await Users.find()
for(user of Allusers){
if(user._id == Code){await Users.findByIdAndDelete(Code)}
}
Res.send(Code + " is Deleted")
})



//App lisening

app.listen(Port, () =>{
    console.log(`Server is started on port ${Port} , The Link: http://localhost:${Port}`)
})