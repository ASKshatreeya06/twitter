const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()



mongoose.connect(process.env.DBURL)

mongoose.connection.on('connected',()=>{
    console.log("db connected");
})

mongoose.connection.on('error',()=>{
    console.log("db not connected");
})