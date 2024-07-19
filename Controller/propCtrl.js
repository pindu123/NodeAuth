const express=require('express')
const jwt=require('jsonwebtoken')
const router=express.Router()
const Uservice=require('../Service/userServ')
const auth=require('../Middleware/middle')
const cookieparser=require('cookie-parser')
const uuid=require('uuid')
const cors=require('cors')
const protectedRoute=require('../Middleware/Protected')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Specify the upload directory

const cloudinary=require('cloudinary')
cloudinary.config({ 
    cloud_name: 'deoqsm3z1', 
    api_key: '762835914166846', 
    api_secret: 'l_C_IhYOJBDY0e0Vm742OEWuUfk' // Click 'View Credentials' below to copy your API secret
});


router.post('/setproperty',protectedRoute,upload.single('image'), async (req,res)=> {
    console.log(req.body)
    const file = req.file;
    console.log(file)
    const data=req.body;
    // console.log(data)
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }
    console.log(file)
    try {
        
        const result = await cloudinary.uploader.upload(file.path);
        
        const d = await Uservice.setProperties(data,result.secure_url);
        console.log(d)
        
            return res.status(200).json({
              message: 'Property uploaded successfully',
            });
        
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        res.status(500).send('Internal server error');
      }
  })

router.get("/profile/:id",protectedRoute, async(req,res) => {
    const id = req.params.id;
    const d = await Uservice.profile(id);
    if(d.length>0){
        res.send({
            message: "data found",
            post: d
        })
    }
    else {
        res.send({message: "Not Found"})
    }
 })

  router.get("/GetPropertiesOnRange/:Landmark1/:Landmark2",protectedRoute,async(req,res)=>{
    const range=req.params;
    const result=await Uservice.fromToLands(range)
    if(result.length>0)
    {
        res.status(200)
        res.send({
            message:"Data retreived successfully",
            post:result
        })
    }
    else
    {
        res.status(500)
        res.send({
            message:"Data  does not exists"
        })
    }
  })

 
  router.post("/getProperties",protectedRoute,cors(),async(req,res)=>{
    const property=await Uservice.getProperties(req.body)
    if(property.length>0)
        {
            res.status(200)
            res.send({
                message:" Properties data",
                post:property
            })
        }
        else
        {
            res.status(200)
            res.send({
                message:"Property data doesnot exists"
            })
        }

 })

  router.post("/addcart",protectedRoute,async(req,res)=>{
    const fav=await Uservice.AddCart(req.body)
    if(fav==1)
    {
    res.status(200)
    res.send({
    message:"Property added to the wishlist"
    })
    }
    else if(fav==2)
    {
    res.status(401)
    res.send({
    "message":"Already Property added to the wishlist"
    })
    }
    else
    {
    res.status(500)
    res.send({
    message:"Property not added to the wishlist"
    })
    }
    })

        router.post("/removeCart",protectedRoute,async(req,res)=>{
            const fav=await Uservice.removeCart(req.body)
            if(fav>0)
            {
            res.status(200)
            res.send({
            message:"Property removed from the wishlist"
            })
            }
            else
            {
            res.status(500)
            res.send({
            message:"Property not removed from the wishlist"
            })
            }
            })

  module.exports=router
  
  