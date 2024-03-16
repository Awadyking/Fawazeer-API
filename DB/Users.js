const mongoose = require("mongoose")
const Schema = mongoose.Schema
let User = new Schema({
    _id : String ,
    Name : String ,
    Answer : String ,
    Status : Boolean ,
    LoginTime : Date ,
    LogoutTime : Date ,
    hex : Number
})

const Users = mongoose.model("Users" , User)
module.exports = Users