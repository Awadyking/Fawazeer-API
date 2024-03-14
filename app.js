const express = require("express")
const app = express();
app.use(express.json());
const Port = 4500 ; 

app.get("/:Code" , (Req , Res) =>{
    let Code = Req.params.Code
    
})


















app.listen(Port , () =>{
    console.log(`Server is started on port ${Port} , The Link: http://localhost:${Port}`)
})