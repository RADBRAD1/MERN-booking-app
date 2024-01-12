import express, {Request, Response} from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";

const router = express.Router();
router.post(" /register", async (req:Request, res: Response) => {
try {
//check if email that user input exists
let user = await User.findOne({
    email:req.body.email
}); //checks the user documents/directory, then tries to find one document(s) 
// that matches the email we recieved in request body


// if user already has an account, return 400 error code saying it exists
if(user){
    return res.status(400).json({ message: "User already exists"});
}
//takes first and last name into the body 
user = new User(req.body);
await user.save();

//have to define paramtypes we want inside our json web token
// ******** Store the info as an environment variable secret key for security.
const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET_KEY as string, {expiresIn: "1d"});
//have to define the jwt separately ourselves. 

res.cookie("auth_token", token, {
    httpOnly:true, 
    secure: process.env.NODE_ENV === "production",
    maxAge: 8640000
});
// the secure argument makes sure that the cookie has to be https
// when doing local devs, not always good to secure because have to setup https
// So, make sure cookies are secure if we are in a production environment
//maxAge of the cookie has to be the same age as the JWT lifespan, but in seconds 
return res.sendStatus(200);


}

catch(error){
    console.log(error); //log error on backend but dont make available for frontend
    res.status(500).send({message: "Something went wrong"});
    //Dont send specific error message b/c it could give specific information for hackers
}


})