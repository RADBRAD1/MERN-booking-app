
//can define functions for a type, in this case like the onClose function

import { useEffect } from "react";

// so it can be used in the code and other functions. 
type ToastProps = {
    message: string;
    type: "SUCCESS" | "ERROR";
    onClose: () => void;
}

//first line , everything () in the arrow function are component props
const Toast = ({message, type, onClose}: ToastProps ) => {  
    //make sure the useEffect hook only runs when component rendered
    useEffect(() => {
        const timer = setTimeout (()=>
        {onClose() }, 5000);

        return ()=> {
            clearTimeout(timer);
            //clears the timer every time the previous component closes
        };
    }, [onClose] // the dependency array is here, makes sure useEffect runs
    //only when component rendered and when onClose is run. 
    );


    //can add conditional styles in tailwind by defining styles type then adding into classname
    const styles = type === "SUCCESS"
        ? "fixed top-4 right-4 z-50 p-4 rounded-md bg-green-600 text-white max-w-md"
        : "fixed top-4 right-4 z-50 p-4 rounded-md bg-red-600 text-white max-w-md"
       
        return(
        <div className = {styles}> 
            <div className = "flex justify-center items-center">
                <span className = "text-lg font-semibold" >
                    {message}
                </span>
            </div>
        </div>
    )
}

export default Toast;