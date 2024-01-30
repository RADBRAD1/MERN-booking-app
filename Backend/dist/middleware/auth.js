"use strict";
// auth functions for middleware defined in this file, isntead of the other auth.ts file
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// have to make sure to import Request and response types from express
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    //first, get the auth token sent to us in the register request. 
    const token = req.cookies["auth_token"];
    if (!token) {
        return res.status(401).json({ message: "unauthorized" });
    }
    //the try block tries to decode the token, if there is an error the catch block will throw us an error
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        // in the routes/users.ts file, we defined token with the sign() function, and set JWT SECRETKEY as the only way to decode jwt
        req.userId = decoded.userId; //we try to add a custom property to req called userId which was not defined in the 
        //parameters, as we jsut said req: Request. in order for it to work we have to extend the express request type. 
        next(); // says we are finished with what we need to do in the middleware, so express can do the next thing it wants to do
    }
    catch (error) {
        return res.status(401).json({ message: "unauthorized" });
    }
};
exports.default = verifyToken;
