import express, {Request, Response} from "express";
import cors from "cors";
import "dotenv/config"; //allows reading of .env file, connection strings
import mongoose from 'mongoose'; //allows database creation and connection using code
import { lstat } from "fs"; 
import userRoutes from './routes/users';
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import myHotelRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";


require('dotenv').config({path: "../.env"});

//starts connection to cloudinary from our backend server
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

//have to copy the string into the mongodb database like follows correctly, can't do the previous importing of the connection string.

//mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);


const mg = require('mongoose');
const dbRoute = 'mongodb+srv://setokaiba123:yyIu2mGjqCE0FWKC@e2e-test-db-mern-hotelb.rjqsbfs.mongodb.net/?retryWrites=true&w=majority'
mongoose.Promise = global.Promise;

mongoose.connect(dbRoute);

let db = mongoose.connection;
db.once('open', () => console.log('connected to the database')); 

// define as string b/c pulling from .env the type is undefined
//mongoose.connect establishes initial db connection. good to have it near the top because w/o db connec. no code runs

const app = express(); // creates an express app
app.use(cookieParser());
app.use(express.json());//converts body of api requests into json
app.use(express.urlencoded({extended: true})); //parse url with parameter, property extended = true
app.use(cors({ 
    origin:process.env.FRONTEND_URL, 
    credentials:true,

}));//cors is a security measure, prevents certain url requests if not agree (ui request is diff port to backend)


app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use("/api/auth",authRoutes);
app.use("/api/users", userRoutes); //API ENDPOINT: if requests have the prefix /api/users, 
// this command passes it on to userRoutes
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);
//hotelRoutes is used for visitors to explore hotels on search page, 
//the myhotel routes is for users to view hotels already saved



app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  });

/* test route for error checking
app.get("/api/test", async (req: Request, res:Response)=> // the arrow parameter has 2 requests
{ 
res.json({message :"hello from express endpoint!"});
}); */

app.listen(7000,()=>{
    console.log("server running on localhost:7000");
}); // starts our server, and we pass in port number and the function to make sure things are ok


