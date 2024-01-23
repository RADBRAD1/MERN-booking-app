import { useForm } from "react-hook-form";
import * as apiClient from '../api-client';
import { useMutation } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type SignInFormData = {
    email:string; password: string;
}

// the sign in page has the same email and password code as the register.tsx page, but only used the code in 2 places so no need to create a separate file
const SignIn = () => {
   
    const { showToast} = useAppContext();
    const navigate = useNavigate(); //useNavigate hook,
    const {register, formState : {errors}, handleSubmit} = useForm<SignInFormData> ();

    //connect signIn function in apiclient to the useMutation hook. 
    const mutation = useMutation(apiClient.signIn, {
        onSuccess: async () => {
            console.log("user has been signed in"); //helps with debugging, log msg. 
            //1. show the toast
            //2. then navigate to the home page 
            showToast({message : "Sign in Successful", type: "SUCCESS"});
            navigate("/") //sends the user back to the home/default page. 
        }, onError: (error: Error)=> {  
            //when we have an error, react query will give us the error that we pass into this arrow function
            //we show the toast with error
            showToast( {message: error.message, type:"ERROR"});

        }

    });

    const onSubmit = handleSubmit((data)=> {
        mutation.mutate(data);
    }
    
    );
    //in the form tag, we pass the onsubmit property to onSubmit parameter in the form. 
return (
<form className = "flex flex-col gap-5 " onSubmit = {onSubmit}>
<h2 className = "text-3x1 font-bold ">
Sign In
</h2>

<label className = "text-gray-700 text-sm font-bold flex-1" >
                   Email 
                    <input type = "email" className = "border rounded w-full py-1 px-2 font-normal" {...register("email", {required: "This field is required"}) }>
                    </input>
                    {errors.email && (
                        <span className = "text-red-500">
                            {errors.email.message}
                        </span>
                    )}
             </label>

             <label className = "text-gray-700 text-sm font-bold flex-1" >
                   Password
                    <input type = "password" className = "border rounded w-full py-1 px-2 font-normal" {...register("password", {required: "This field is required", minLength:{ value:6, message: "Password must be at least 6 characters"} }) }>
                    </input>
                    {errors.password && (
                        <span className = "text-red-500">
                            {errors.password.message}
                        </span>
                    )}
             </label>

             <span >
                    <button type = "submit" className = "bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl ">
                        Login
                    </button>
            </span>

</form>

)
}

export default SignIn;