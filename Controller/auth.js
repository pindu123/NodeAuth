// const express=require('express')
// const router=express.Router()
// const jwt=require('jsonwebtoken')

//  const authMiddle=(req,res,next)=>{
//     const token=jwt.sign({uname:req.body.uname},'privatekey')
//     res.cookie("token",token,{
//         maxAge:10000,
//         httpOnly:true,
//      })
//      next();
// }

// module.exports=authMiddle;

const jwt = require('jsonwebtoken');

const authMiddle = (req, res, next) => {
    const token = jwt.sign({ uname: req.body.uname }, 'privatekey', { expiresIn: '10m' });
    res.cookie("token", token, {
        maxAge: 10 * 60 * 1000, // 10 minutes
        httpOnly: true,
    });
    req.token=token
    next();
};

module.exports = authMiddle;
