import express, {Request, Response} from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import {check,  validationResult} from "express-validator";
import verifyToken from "../middleware/auth";


const router = express.Router();

//endpoint that lets use fetch the current logged in user
//makes it so that UI does not need to know ID of current loggedin user, its in the http cookie anyways
// 
router.get("/me", verifyToken, async (req: Request, res: Response) => {
    const userId = req.userId;
    //verifyToken parses the http cookie that is sent, gives it to the request which is how we get 
    //userID 
  
    try {
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "something went wrong" });
    }
  });

// second argument is an endpoint handler
router.post("/register", [check("firstName", "First Name is required").isString(),
check("lastName", "Last Name  is required").isString(),
check("email","Email is required").isEmail(),
check("password", "Password with 6 or more characters required").isLength({min:6,}),
], async (req:Request, res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({message:errors.array()})
    }
try {
//check if email that user input exists
let user = await User.findOne({
    email: req.body.email,
}); //checks the user documents/directory, then tries to find one document(s)that matches the email we recieved in request body

// if user already has an account, return 400 error code saying it exists
if(user){
    return res.status(400).json({ message: "User already exists"});
}
//takes first and last name into the body 
user = new User(req.body);
await user.save();

//have to define paramtypes we want inside our json web token
// ******** Store the info as an environment variable secret key for security.
const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET_KEY as string, {expiresIn: "1d",});
//have to define the jwt separately ourselves. 

res.cookie("auth_token", token, {
    httpOnly:true, 
    secure: process.env.NODE_ENV === "production",
    maxAge: 8640000
});
// the secure argument makes sure that the cookie has to be https when doing local devs, not always good to secure because have to setup https
// So, make sure cookies are secure if we are in a production environment maxAge of the cookie has to be the same age as the JWT lifespan, but in milliseconds 
return res.sendStatus(200).send({message :"User registered OK"});
}

catch(error){
    console.log(error); //log error on backend but dont make available for frontend
    res.status(500).send({message: "Something went wrong"});
    //Dont send specific error message b/c it could give specific information for hackers
}

});

export default router;