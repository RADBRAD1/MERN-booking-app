//created a signout button section instead of just under a generic <button> tag is because it allows us to encapsulate signout logic in one place
// has api call to logout and markup for button itself.

import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";


const SignOutButton = ()=> {
    const {showToast} = useAppContext(); 


    const mutation = useMutation(apiClient.signOut , {
        onSuccess: ()=> {   
            //show toast
            showToast({message: "Signed Out!", type: "SUCCESS"});

        }, onError : (error: Error)=> {
            //show Toast 
            showToast({message: error.message, type: "ERROR"});
            //the error.message gets passed to us from react query from the apiClient argument parameter when an error occurs. 
        }
    });
    //need an onclick button handler
   //whenever the button tag is called, the onclick property defined calls this handleClick function. 
    const handleClick = ()=> {
         //this function just invokes the api call, dont have to pass any data into mutate function
        mutation.mutate();
    }



    return (
        <button onClick = {handleClick} className = "text-blue-600 px-3 font-bold bg-white hover:bg-gray-100">
            Sign Out
        </button>

    )

}


// have to connect the signout button to the logout API endpoint within the button

export default SignOutButton;