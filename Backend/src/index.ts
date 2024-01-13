import express, {Request, Response} from "express";
import cors from "cors";
import "dotenv/config"; //allows reading of .env file, connection strings
import mongoose from 'mongoose'; //allows database creation and connection using code
import { lstat } from "fs";
import userRoutes from './routes/users';

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)// define as string b/c pulling from .env the type is undefined
//mongoose.connect establishes initial db connection. good to have it near the top because w/o db connec. no code runs

const app = express(); // creates an express app
app.use(express.json());//converts body of api requests into json
app.use(express.urlencoded({extended: true})); //parse url with parameter, property extended = true
app.use(cors());//cors is a security measure, prevents certain url requests if not agree (ui request is diff port to backend)

app.use("/api/users", userRoutes); //API ENDPOINT: if requests have the prefix /api/users, 
// this command passes it on to userRoutes


/* test route for error checking
app.get("/api/test", async (req: Request, res:Response)=> // the arrow parameter has 2 requests
{ 
res.json({message :"hello from express endpoint!"});
}); */

app.listen(7000,()=>{
    console.log("server running on localhost:7000");
}); // starts our server, and we pass in port number and the function to make sure things are ok


