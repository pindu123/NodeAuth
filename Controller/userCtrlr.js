const express=require('express')
const jwt=require('jsonwebtoken')
const router=express.Router()
const Uservice=require('../Service/userServ')
const auth=require('../Middleware/middle')
const cookieparser=require('cookie-parser')
const uuid=require('uuid')
const cors=require('cors')
const protectedRoute=require('../Middleware/Protected')
 
// For handling multipart/form-data (file uploads)
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Specify the upload directory

const cloudinary=require('cloudinary')
const db = require("../db");
// const storage = multer.memoryStorage(); 
// const upload = multer({ storage: storage });
const authMiddle=require('./auth')
 


router.post('/insert',cors(),async (req,res)=>{

    console.log(req.body)
try
{
    const U= await Uservice.checkAvail(req.body)
    console.log(U)
    if(U)
    {
        res.status(400)
        res.send({
            message:"Email already exists!! try with another"

        })
    }
    else{
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

}
}
catch(error)
{
    res.status(400)
    res.send({
        message:"Something went wrong"
    })
}
 })
 
//  router.use("/auth",authMiddle)
 

cloudinary.config({ 
    cloud_name: 'deoqsm3z1', 
    api_key: '762835914166846', 
    api_secret: 'l_C_IhYOJBDY0e0Vm742OEWuUfk' // Click 'View Credentials' below to copy your API secret
});

router.post('/upload', upload.single('image'), async (req, res) => {
    const file = req.file;
    const data=req.body;
    console.log(data)
  
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }
  console.log(file)
    try {
       
      const result = await cloudinary.uploader.upload(file.path);
      

 
      res.status(200).json({
        message: 'Image uploaded successfully',
        imageUrl: result.secure_url // Cloudinary URL for the uploaded image
      });
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      res.status(500).send('Internal server error');
    }
  });



   
 
router.post("/login",cors(),async (req,res)=>{
    // console.log("Hello");
    const data= await Uservice.CheckUser(req.body)
    // console.log( req.body.email )
    if(data)
    {
    const token = jwt.sign(
    { userId: 1 },
    process.env.ACCESS_TOKEN_SECRET,
    {
    expiresIn: "1h",
    }
    );
    res.status(200)
    res.send({
    message:"Login Successfull",
    Token:token
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

//  router.get('/image/:id', async (req, res) => {
//     const imageId = req.params.id;
  
//     // Query to fetch image data from database
//     const sql = 'SELECT image FROM sample WHERE id = ?';
//     try {
//       const [result] = await db.query(sql, [imageId]);
//       if (result.length === 0) {
//         return res.status(404).json({ error: 'Image not found' });
//       }
//       console.log(result)
//       const base64Image = result[0].image;
//     //   console.log(base64Image)
//       const imageBuffer = Buffer.from(base64Image, 'base64');
  
//       res.set('Content-Type', 'image/jpeg'); // Adjust content type based on your image format
//       res.send(imageBuffer);
//     } catch (error) {
//       console.error('Error retrieving image from database:', error);
//       res.status(500).json({ error: 'Failed to retrieve image' });
//     }
//   });


  router.post('/setproperty',upload.single('image'), async (req,res)=> {
    const file = req.file;
    const data=req.body;
    // console.log(data)
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }
    console.log(file)
    try {
        
        const result = await cloudinary.uploader.upload(file.path);
        
        const d = Uservice.setProperties(data,result.secure_url);
        if(d>0) {
            res.status(200).json({
              message: 'Image uploaded successfully',
            });
        }
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        res.status(500).send('Internal server error');
      }
  })


//  router.get('/logout',async (req,res)=>{
//     console.log("helloworld")
//     const token = req.cookies.token || req.headers['authorization'];
//     console.log(token)
//       const [t]=Object.keys(req.cookies)
//      console.log(t)
//        res.clearCookie(t)
//        res.send({
//         message:"Logout Successful"
//        })

//  })

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

//  router.get("/protected/profile/:id",protectedRoute, async(req,res) => {
//     const id = req.params.id;
//     const d = await Uservice.profile(id);
//     if(d.length>0){
//         res.send({
//             message: "data found",
//             post: d
//         })
//     }
//     else {
//         res.send({message: "Not Found"})
//     }
//  })


 
module.exports=router

router.get("/admindashboard", async(req,res)=> {
    const d = await Uservice.adminDash()
    if(d.length==0){
        return res.send({message:"no properties found"})
    }else {
        return res.send({"properties":d})
    }
})

router.post("/ContactUs",async (req,res)=>{
    const c=await Uservice.contact(req.body)
    if(c>0)
    {
    res.status(200)
    res.send({
    message:"Query submitted successfully"
    })
    }
    else
    {
    res.status(500)
    res.send({
    message:"Query not submitted successfully"
    })
    }
    
    })

// [
    // {
    //   "PropertyId": 1,
    //   "UserId": 1,
    //   "PropertyType": "land",
    //   "state": "Andhra Pradesh",
    //   "city": "Vishakapatnam",
    //   "pincode": 530001,
    //   "propertyLandmark": "Bhemili",
    //   "ExpectedPrice": 656786,
    //   "area": 2500,
    //   "AdminApproval": 1,
    //   "Siteimage": "https://res.cloudinary.com/deoqsm3z1/image/upload/v1721381483/ja8jbxye6mfvggjzblxy.png",
    //   "email": "panchireddi@gmail.com"
    // },
//     {

  