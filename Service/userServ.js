const db=require('../db')
const bcrypt = require('bcrypt');

module.exports.checkAvail=async(data)=>{

   const[rows]=await db.query("select 1 from User where email=?",[data.email])
   console.log(rows.length)
   return rows.length>0;
}

module.exports.adminDash = async()=> {
   const [rows] = await db.query("select * from adminDashBoard");
   // console.log(rows)
   // let a = [];
   let pid = rows.map(item=>{return item.PropertyId})
   console.log('pid', pid.join(','))
   const [pdata]=await db.query(`select P.PropertyType,P.city,P.state,P.ExpectedPrice,P.Siteimage,U.Fname, U.email, U.Phno from Properties P inner join User U on U.UserId = P.UserId where PropertyId in (${pid.join(',')})`)
   console.log(pdata)
   return pdata;
}
module.exports.addUser=async (obj)=>{

   const hashed = await bcrypt.hash(obj.password,10);
   const [{affectedRows}] = await db.query("insert into User (Fname, Lname, aadhar, state, city, pincode, Phno, email, password) values(?,?,?,?,?,?,?,?,?)",[obj.Fname,obj.Lname,obj.aadhar,obj.state,obj.city,obj.pincode,obj.Phno,obj.email,hashed])
   console.log(affectedRows)
   return affectedRows;
}

module.exports.CheckUser=async (obj)=>{
   // console.log(obj.email)
   const [rows]=await db.query("select email,password from User where email=?",[obj.email])
   if (rows.length === 0) {
   return false;
   }
   const user = rows[0];
   const passwordMatch = await bcrypt.compare(obj.password, user.password);
   
   if (!passwordMatch) {
   return false;
   }
   return true;
   }


   module.exports.setProperties = async (obj1, obj2) => {
      console.log(obj1.email, obj2);
      const q1 = "SELECT UserId FROM User WHERE email = ?";
      
      try {
          const [rows] = await db.query(q1, [obj1.email]);
          
          if (rows.length === 0) {
              throw new Error('User with email not found');
          }
   
          const id = rows[0].UserId;
          const q2 = "INSERT INTO Properties (UserId, PropertyType, state, city, pincode, propertyLandmark, ExpectedPrice, area, AdminApproval, Siteimage, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
          
          const { affectedRows } = await db.query(q2, [
              id, obj1.PropertyType, obj1.state, obj1.city, obj1.pincode,
              obj1.propertyLandmark, obj1.ExpectedPrice, obj1.area, obj1.AdminApproval,
              obj2, obj1.email
          ]);
   
          return affectedRows;
      } catch (error) {
          console.error('Error setting properties:', error);
          throw error; // Re-throw the error to handle it in the caller function
      }
   }

   module.exports.profile = async(obj1) => {
      const q1 = "select Fname,email,Phno from User where Userid = ?";
      const [row] = await db.query(q1,[obj1]);
      if(row.length===0){
         return []
      }
      else{
         return row
      }
   }
   
   module.exports.fromToLands = async(obj1) => {
      const l1=obj1.Landmark1
      const l2=obj1.Landmark2
      const q1="select city from Properties where propertyLandmark=?";
      const [d]= await db.query(q1,[l1]);
      
      const q2="select city from Properties where propertyLandmark=?";
      const [d1]=await db.query(q2,[l2]);
      // console.log(l1,l2,d,d1)

         if(d.length==0 && d1.length!=0){
            const city2=d1[0].city
            const [rows]=await db.query("select * from Properties where city=?",[city2])
            return rows;
         }
         else if(d1.length==0 && d.length!=0){
            const city1=d[0].city
            const [rows]=await db.query("select * from Properties where city=?",[city1])
            return rows;
         }
         else if(d1.length!=0 && d.length!=0) {
            const city1=d[0].city;
            const city2=d1[0].city
            // console.log(city1,city2)
            const [rows]= await db.query("select * from Properties where city=? or city=?",[city1,city2])
            console.log(rows)
            return rows;
         }
         else {
            return []
         }
      }


module.exports.getProperties=async(data)=>{
   let q1=`select * from Properties where 1=1 `;
   console.log(data)
   const city=data.city;
   const maxi=Number(data.maxPrice);
   console.log(maxi)
   const type=data.PropertyType;
   if(city!=null) {
      console.log(city)
      q1 = q1 + `and city like '%`+city+`%' `;
   }
   
   if(type!=null) {
      q1 = q1 + ` and PropertyType like '%`+type+`%'`;
   }
   if(maxi!=0) {
      q1 = q1 + `and ExpectedPrice between 0 and `+maxi+``;
   }
   const [rows] = await db.query(q1);
   return rows;

}


module.exports.contact=async(obj)=>{
   const q="insert into Contact( email,description,status) values(?,?,?)";
   const [{affectedRows}]=await db.query(q,[obj.email,obj.description,obj.status]);
   
   return affectedRows;
   }

   module.exports.AddCart=async(obj)=>{
      const [Cdata]= await db.query("select * from Wishlist where PropertyId=?",obj.PropertyId);
      if(Cdata.length>0)
      {
      return 2
      }
      else
      {
      
      const q="insert into Wishlist(UserID,PropertyId) values(?,?)";
      const[{affectedRows}]=await db.query(q,[obj.UserID,obj.PropertyId])
      
      return affectedRows;
      }
      }

      module.exports.removeCart=async(id)=>{
         console.log(id)
         const q="delete from Wishlist where wishId=?"
         const [{affectedRows}]=await db.query(q,[id.wishId])
         return affectedRows;
         }