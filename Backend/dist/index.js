"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config"); //allows reading of .env file, connection strings
const mongoose_1 = __importDefault(require("mongoose")); //allows database creation and connection using code
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./routes/auth"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
/*import myHotelRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";*/
require('dotenv').config();
//have to copy the string into the mongodb database like follows correctly, can't do the previous importing of the connection string.
mongoose_1.default.connect(process.env.MONGODB_CONNECTION_STRING);
//const db = mongoose.connect('mongodb+srv://setokaiba123:yyIu2mGjqCE0FWKC@e2e-test-db-mern-hotelb.rjqsbfs.mongodb.net/?retryWrites=true&w=majority')
// define as string b/c pulling from .env the type is undefined
//mongoose.connect establishes initial db connection. good to have it near the top because w/o db connec. no code runs
const app = (0, express_1.default)(); // creates an express app
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json()); //converts body of api requests into json
app.use(express_1.default.urlencoded({ extended: true })); //parse url with parameter, property extended = true
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
})); //cors is a security measure, prevents certain url requests if not agree (ui request is diff port to backend)
app.use("/api/auth", auth_1.default);
app.use("/api/users", users_1.default); //API ENDPOINT: if requests have the prefix /api/users, 
// this command passes it on to userRoutes
//app.use("/api/my-hotels", myHotelRoutes);
//app.use("/api/hotels", hotelRoutes);
//app.use("/api/my-bookings", bookingRoutes);
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../frontend/dist/index.html"));
});
/* test route for error checking
app.get("/api/test", async (req: Request, res:Response)=> // the arrow parameter has 2 requests
{
res.json({message :"hello from express endpoint!"});
}); */
app.listen(7000, () => {
    console.log("server running on localhost:7000");
}); // starts our server, and we pass in port number and the function to make sure things are ok
