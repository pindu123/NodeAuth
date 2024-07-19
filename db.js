const mysql=require('mysql2/promise')


const mySqlConnect= mysql.createPool({
    host:process.env.HOST_NAME,
    user:process.env.DATABASE_USER,
    port:process.env.DB_PORT,
    password:process.env.DB_PASSWORD,
    database:process.env.DATABASE_NAME
})

module.exports=mySqlConnect