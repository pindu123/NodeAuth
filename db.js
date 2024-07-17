const mysql=require('mysql2/promise')

const mySqlConnect= mysql.createPool({
    host:"localhost",
    user:"root",
    port:"3306",
    password:"M1racle@123",
    database:"ITGDB"

})

module.exports=mySqlConnect