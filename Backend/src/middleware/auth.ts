// auth functions for middleware defined in this file, isntead of the other auth.ts file


// separate middleware authorization function so api logic is not cluttered. 


import { NextFunction, Request, Response} from "express";
// have to make sure to import Request and response types from express

import jwt, { JwtPayload } from 'jsonwebtoken';


declare global
{
    namespace Express{
            interface Request{
                userId:string; 
                //add userId to the Request type in the Request namespace, so we have the userId property in the try catch block below. 
            }
    }
    // can do this same type of code to extend the express request type to whatever type I want. 
}

const verifyToken = (req:Request, res:Response, next: NextFunction) => {
    //first, get the auth token sent to us in the register request. 
    const token = req.cookies["auth_token"];
    if(!token){
        return res.status(401).json({message: "unauthorized"});
    }

    //the try block tries to decode the token, if there is an error the catch block will throw us an error

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY as string);
        // in the routes/users.ts file, we defined token with the sign() function, and set JWT SECRETKEY as the only way to decode jwt

        req.userId = (decoded as JwtPayload).userId; //we try to add a custom property to req called userId which was not defined in the 
        //parameters, as we jsut said req: Request. in order for it to work we have to extend the express request type. 

        next(); // says we are finished with what we need to do in the middleware, so express can do the next thing it wants to do
    
    }
    catch(error) {
        return res.status(401).json({message: "unauthorized"});
    }

}

export default verifyToken;
