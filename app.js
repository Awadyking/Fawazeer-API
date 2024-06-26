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


let Datenow =  Math.trunc( new Date().getTime() / 1000) ;
let nextTime ;


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
let Type = Req.body.Type

newUser._id = Code
newUser.Name = Name
newUser.Answer = Answer
newUser.Status = Status
newUser.LoginTime = LoginTime
newUser.LogoutTime = LogoutTime
newUser.Type = Type

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


app.put("/UType/" , async(Req ,Res) =>{
    let All = await Users.find()
    let Code
    let User
for(user of All){
    Code = Req.body.Code
    if(Code == user._id){
    User = await Users.findById(Code)
    Res.json(User.Type)
    }
}

})

app.put("/Logout" , async (Req , Res) => {
    const Code = Req.body.Code
    await Users.findByIdAndUpdate(Code , {
        Answer : Req.body.Answer , 
       LogoutTime : Req.body.LogoutTime 
    });
    Res.send("Okay")
})




async function Timed(x){
    Datenow = Math.trunc( new Date().getTime() / 1000) ;
    let QuesFind = await Question.findById(1)
    let QuesAll = await Question.find()
    let QuesAllArr = [];
    nextTime = Datenow + QuesFind.Timer
    let QuesType = QuesFind.Type
    let Winners = [] ;

setInterval(()=>{
Datenow = Math.trunc( new Date().getTime() / 1000) ;
if(x == true){
if(Datenow == nextTime){
async function G(){
    await Question.findByIdAndUpdate(1 , {QS : false});
    let AllU = await Users.find()
    for(User of AllU){
        if(QuesType == "Choose"){
            if(User.Answer == QuesFind.True){Winners.push([User.Name , User.LogoutTime , User.Answer])}
            }
    }

    for(Ques of QuesAll){QuesAllArr.push(Ques)}

    if(QuesAllArr.length > 1){
    let i = Math.floor(Math.random() * Winners.length)
    if(Winners.length == 0){async function R(){await Question.findByIdAndUpdate(1 , {Winner : []})}; R()}
    else{async function H(){await Question.findByIdAndUpdate(1 , {Winner : Winners[i]})}; H()}
    }
}
G()


        
}

}},1000)


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
    let TrueAnswerShow = Req.body.TrueAnswerShow 
    let VTimer = Req.body.VTimer
    newQues._id = 1
    newQues.ShowTrue = false
    newQues.Ques = Quest
    newQues.A = A
    newQues.B = B
    newQues.C = C
    newQues.D = D
    newQues.F = F
    newQues.True = True
    newQues.Type = Type
    newQues.Timer = Timer
    newQues.TrueAnswerShow = TrueAnswerShow
    newQues.VTimer = VTimer
    newQues.QS= true
    newQues.Winner = []
    await newQues.save()
     Timed(true)

Res.send("The Question Saved")
    
}else{Res.send("The Password is Wrong!")}

})

// Reset
app.delete("/reset" , async (Req , Res) =>{
Quesfind = await Question.find()
let QuesArr = []
for(Quest of Quesfind){QuesArr.push(Quest._id)}
if(QuesArr.length > 1){
await Question.findByIdAndDelete(1)
let Alluser = await Users.find()
let Code = "";
for (user of Alluser){
    Code = user._id;
    await  Users.findByIdAndUpdate(Code , {
    Answer : "" ,
    Status : false,
    LoginTime : null ,
    LogoutTime : null,
    textCorrect: "",
    })
}
}

Res.send("Deleted Successfully")
})






//Result

app.delete("/resetU" , async(Req , Res) =>{
    let Code = Req.body.Code
    await  Users.findByIdAndUpdate(Code , {
        Answer : "" ,
        Status : false,
        LoginTime : null ,
        LogoutTime : null,
        textCorrect: "",
        })
        Res.send(Code + " is Reseted")
})





app.get("/Result" , async (Req , Res) =>{
let Winners = [] 
let Lossers = []
let QuesAll = await Question.find()
let Type;
let TrueAnswerShow;
if(QuesAll.length == 1){
    TrueAnswerShow = ""
    Type = ""
}
else{
let Allusers = await Users.find()
let Quesfind = await Question.findById(1)
TrueAnswerShow = Quesfind.TrueAnswerShow
Type = Quesfind.Type
let ShowTrue = Quesfind.ShowTrue


for(user of Allusers){   
if(Quesfind.Type == "Choose"){
if(user.Answer == Quesfind.True){Winners.push([user.Name , user.LogoutTime , user.Answer])}
else{Lossers.push([user.Name , user.LogoutTime , user.LoginTime , user.Answer])}


}if(Quesfind.Type == "Text"){
    if(ShowTrue == true){
        if(user.textCorrect == "T"){Winners.push([user.Name , user.LogoutTime , user.Answer]) ;}
        else{Lossers.push([user.Name , user.LogoutTime , user.LoginTime , user.Answer])}
    }else{Winners.push("UnderCorrect")}
}


}

}
let WinsQ = await Question.findById(1);

Res.json({Winners , Lossers , TrueAnswerShow , Type , WinsQ})
})






app.get("/Ques" , async(Req , Res) => {
let Quesfind = await Question.find()
let QuesArr=[]
for(Quest of Quesfind){QuesArr.push(Quest)}
let Time ;
if(QuesArr.length > 1){Time = nextTime - Datenow;}
Res.json({Time , QuesArr})

})

app.get("/Users" , async(Req , Res) => {
    let Allusers = await Users.find()
    Res.json(Allusers)
})


app.put("/DelUsers" , async (Req , Res)=>{
let Code = Req.body.Code
let Allusers = await Users.find()
for(user of Allusers){
if(user._id == Code){await Users.findByIdAndDelete(Code)}
}
Res.send(Code + " is Deleted")
})



app.put("/Correct" , async (Req , Res) =>{
    let Data = Req.body.Data
    let Allusers = await Users.find()
    let Winners = [];
    let i = 0
    let x;

for(user of Allusers){
   if(Data[i][1] == "T"){
    x =await Users.findById(Data[i][0])
    Winners.push([x.Name , x.LogoutTime, x.Answer])
    await Users.findByIdAndUpdate(Data[i][0] , {textCorrect : "T"})
   }else{await Users.findByIdAndUpdate(Data[i][0] , {textCorrect : "F"})}
i++;
}
    if(Winners.length > 1 ){
        let c = Math.floor(Math.random() * Winners.length)
        if(Winners.length == 0){await Question.findByIdAndUpdate(1 , {Winner : []})}
        else{await Question.findByIdAndUpdate(1 , {Winner : Winners[c]}) ;}
    }
await Question.findByIdAndUpdate(1,{ShowTrue : true})

        Res.send("All is Corrected")
})



//App lisening

app.listen(Port, () =>{
    console.log(`Server is started on port ${Port} , The Link: http://localhost:${Port}`)
})