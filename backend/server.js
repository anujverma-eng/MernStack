const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database")

// Config     *****     Jan,30 - 15:15 //
dotenv.config({path:"backend/config/config.env"});

// Connecting to database     *****     Jan,30 - 19:23 //
connectDatabase()

app.listen(process.env.PORT,()=>{

    console.log(`Server is Working on http://localhost:${process.env.PORT}`);
    
})