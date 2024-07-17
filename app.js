const express=require('express')
const cookieparser=require('cookie-parser')
const cors=require('cors')
const app=express()

const protected=require('./Middleware/Protected')
app.use(cookieparser ())
const routes=require('./Controller/userCtrlr')
 app.use(cors())
app.use(express.json())
 app.use((req,res,next)=>{
    console.log("Cookies: ", req.cookies);    next()
 })

 
app.use("/User",routes)

app.use("/protected",protected)

app.listen(4200,()=>{
    console.log("Server is running on the port 4200.. ")
})