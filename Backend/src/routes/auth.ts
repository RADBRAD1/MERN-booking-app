
import express, {Request,Response} from "express";
import { check } from "express-validator";
import { query, Result, validationResult } from 'express-validator';
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.post("/login", [
    check("email", "Email is required").isEmail(), 
    check("password", "Password with 6 or more characters required" ).isLength({min: 6}),

], async (req:Request, res: Response) => 
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({message: errors.array() });
    }

    const{email,password} = req.body; // object destructures the email and password properties form req.body

    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "Invalid Credentials"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        //takes the password we get from the request, does the hashing for the password security. 
        
        if(!isMatch){
            return res.status(400).json({message: "Invalid Credentials"});
        }

        //create access token and return it as HTTP cookie
        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET_KEY as string,
            {expiresIn: "1d"});
            
        res.cookie("auth_token", token, {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            maxAge:86400000
        });

        res.status(200).json({userId: user._id});

        }
    
    catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong"});
    }

});


// this endpoint, whenever we make a get request, it will run the middleware "verifyToken"(which checks the http cookie sent to us by the frontend
// to see if the cookie passes the test). if it passes the test, the middleware sends info to the arrow ufnction and sends 200 status as well as the userId
//which was passed to us in the request. 
router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
res.status(200).send({userId: req.userId})
});

router.post("/logout", (req:Request, res:Response) => {
    res.cookie("auth_token", "", {expires: new Date(0),});//instead of passing in a normal cookie, pass in an empty string as an auth_token. 
    //this token is also set to expire at the time of creation, and cant be used again after logout function called. 

    res.send(); //necessary, because we create the auth token and cookie above but need to send it
    //that way the request will not hang and stay pending. make sure the requests are sent at the end of the handler. 
})

export default router;