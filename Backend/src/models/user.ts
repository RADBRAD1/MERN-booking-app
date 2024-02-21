
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserType } from "../shared/types";

 // when we talk to frontend, this top section makes sure we have
// all the correct variables and types. 

const userSchema = new mongoose.Schema(
    {
        email: {type: String, required : true, unique: true},
        password: {type: String, required: true},
        firstName:{type: String, required: true},
        lastName: {type: String, required: true},
    }
);// need to pass an object into schema, so we can import db data


//middleware for MongoDB, says before updates to password you save them 
userSchema.pre("save", async function(next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }
    next();
});


const User = mongoose.model<UserType>("User", userSchema)

//specify names of documents associated with the model, and we like "User" to userSchema object


//mongoose model provides interface to DB for performing actions 
//mongose schema defines doc structure, i.e. default values, validators

export default User;