const db=require('../db')

module.exports.addUser=async (obj)=>{
   const [{affectedRows}] = await db.query("insert into User values(?,?)",[obj.uname,obj.paswd])
   console.log(affectedRows)
   return affectedRows;
}

module.exports.CheckUser=async (obj)=>{
     const [rows]=await  db.query("select username from User where username=? and password=?",[obj.uname,obj.paswd])
    console.log(rows.length)
    return rows.length > 0;
}

module.exports.getEmp=async()=>{
   const [rows]=await db.query("select * from Employee")
   console.log(rows.length)
   return rows;
}