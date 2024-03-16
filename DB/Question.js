const mongoose = require("mongoose")
const Schema = mongoose.Schema
let Ques = new Schema({
    _id : Number ,
    Ques : String ,
    A : String ,
    B : String ,
    C : String ,
    D : String ,
    F : String , 
    True : String 
})

const Question = mongoose.model("Question" , Ques)
module.exports = Question