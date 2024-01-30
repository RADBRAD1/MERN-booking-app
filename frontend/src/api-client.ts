// where we put all fetch requests
//put in this separate file b/c separating requests from other code makes things cleaner

import {RegisterFormData} from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";

//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_BASE_URL = `http://localhost:7000`; //not 5173, because it just matters about the backend port number, not frontend. we hard coded the 
//environment variable number here as opposed to accessing the API_BASE_URL which was `undefined` before. 


// the async function takes in data from registerForm data, which is defined in type registerformdata in register.tsx
export const register = async (formData:RegisterFormData) => {
    console.log(API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/api/users/register`, { method: 'POST', headers :{
        "Content-type": "application/json"}, credentials: "include", body: JSON.stringify(formData),
    });


//get body of the response, awaits for it and converts it to json
const responseBody = await response.json();

if(!response.ok){
    throw new Error(responseBody.message);
}
return responseBody; 

/////
//////
/////
// is this necessary? i didnt have this before but the signIn api endpoint had return body so i added this?
}; 

//this signin function for the api client defines an arrow function that takes in formdata defined in SignInFormData
//sign in endpoint creation here
// call this sign in function whenever the user submits valid form.
export const signIn = async (formData: SignInFormData) => {
const response = await fetch(`${API_BASE_URL}/api/auth/login`, { method: "POST", credentials: "include",
headers: { "Content-Type": "application/json"}, body: JSON.stringify(formData),
});

const body = await response.json();

//response.json returns error details under the message property, so we can call for it when handling errors
if(!response.ok){
    throw new Error(body.message);
}
return body;

}

export const validateToken = async ()=> {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {  
        credentials: "include" //tells browser to send any cookies with the request given to the endpoint. 
    }); //sets validateToken endpoint here. 

    if(!response.ok)
    {
        throw new Error("token Invalid");
    }

    return response.json();

};

//endpoint for logging out, access the backend signout function from the auth.ts in routes folder from backend. 
export const signOut = async ()=> {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {credentials : "include", method: "POST", })
    if(!response.ok)
    {
        throw new Error("Error during signout");
    }



};




