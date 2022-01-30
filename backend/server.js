const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

// ! Handling Uncaught Exception : Example you use a variable but didn't declare it, it will throw this exception *****     Jan,31 - 04:54 //
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the Server due to Uncaught Exception`);
    process.exit(1);
});

// Config     *****     Jan,30 - 15:15 //
dotenv.config({path:"backend/config/config.env"});

// Connecting to database     *****     Jan,30 - 19:23 //
connectDatabase()

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is Working on http://localhost:${process.env.PORT}`); 
});

// ! Unhandled Promise Rejections, if you got error, Like u change the string of ( DB_URI ) in Config.env    *****     Jan,31 - 04:40 //
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the Server due to Unhandled Promise Rejection`);
    server.close(()=>{
        process.exit(1);
    });  
    
});