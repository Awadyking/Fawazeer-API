const mongoose = require("mongoose")
const Schema = mongoose.Schema
let Ques = new Schema({
    Ques : String ,
    A : String ,
    B : String ,
    C : String ,
    D : String ,
    True : String
})

const Question = mongoose.model("Ques" , Ques)
module.exports = Question