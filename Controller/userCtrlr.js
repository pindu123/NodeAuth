const express=require('express')
const jwt=require('jsonwebtoken')
const router=express.Router()
const Uservice=require('../Service/userServ')
const auth=require('../Middleware/middle')
const cookieparser=require('cookie-parser')
const uuid=require('uuid')
const cors=require('cors')
const protectedRoute=require('../Middleware/Protected')

const authMiddle=require('./auth')
 


router.post('/insert',cors(),(req,res)=>{

    console.log(req.body)
    const d=Uservice.addUser(req.body);
     
     if(d!=0)
    {
        res.status(200)
         res.send({
            message:"Data inserted Successfully"
        })
    }
    else
    { 
        res.status(500)
        res.send({
           message:  "Data is not Inserted Successfully"
        })
    }

    
 })
 
 router.use("/auth",authMiddle)
 
 router.post("/auth/login",cors(),async (req,res)=>{
    console.log("Hello")
    // const token=jwt.sign({uname:req.body.uname},'privatekey')
    // res.cookie("token",token,{
    //     maxAge:10000,
    //     httpOnly:true,
    //  })
 
    // console.log(req.cookies)
    //   if(req.cookies.token)
    //   {
    // //    const v=jwt.verify(req.cookies.token,'privatekey')
    //    console.log(v) 
    //   }
    const data= await Uservice.CheckUser(req.body)
    console.log( data)
      if(data)
    {
        res.status(200)
        res.send({
            message:"Login Successfull",
            Token:req.token
        })

    }
    else
    {
        res.status(500)
        res.send({
            message:"Login Unsuccessful"
        })
    }

 })

 router.get('/protected/resource', protectedRoute, (req, res) => {
    res.status(200).send({
        message: 'Protected resource accessed successfully',
        user: req.user  
    });
});
 router.get('/logout',cors(),async (req,res)=>{
    console.log("helloworld")
    const token = req.cookies.token || req.headers['authorization'];
    console.log(token)
      const [t]=Object.keys(req.cookies)
     console.log(t)
       res.clearCookie(t)
       res.send({
        message:"Logout Successful"
       })

 })

 router.get('/protected/data',protectedRoute,cors(),async (req,res)=>{
    const emp= await Uservice.getEmp();
    console.log(emp)
    if(emp.length>0)
    {
        res.status(200)
        res.send({
            message:"Employee data",
            user:req.user,
            post:emp
        })
    }
    else
    {
        res.status(500)
        res.send({
            message:"Employee data doesnot exists"
        })
    }

 })
 
module.exports=router