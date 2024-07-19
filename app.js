const express=require('express')
const cookieparser=require('cookie-parser')
const cors=require('cors')
const dotenv = require('dotenv');
const app=express()
dotenv.config()
const protected=require('./Middleware/Protected')
app.use(cookieparser ())
const routes=require('./Controller/userCtrlr')
const proc = require('./Controller/propCtrl')
 app.use(cors())
app.use(express.json())
//  app.use((req,res,next)=>{
//     console.log("Cookies: ", req.cookies);    next()
//  })
const port = 3000;
 
app.use("/User",routes)

app.use("/protected",proc)


app.listen(port,()=>{
    console.log(`Server is running on the port ${port}.. `)
})