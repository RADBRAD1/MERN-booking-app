import {Link} from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

//react-router-dom has bindings for using react router on the web

//header file here determines what links are shown, should be different if you are signed in or not. 
//use isLoggedIn property from appContexts to make the displays different depending on the signedin status

const Header = () => { 
    const {isLoggedIn} = useAppContext();

    return(
        <div className = "bg-blue-800 py-6"> 
        <div className = "container mx-auto flex justify-between "> 
            <span className = "text-3x1 text-white font-bold tracking-tight">
                <Link to = "/"> PorttoWesteros.com
                </Link>
            </span>
            <span className = "flex space-x-2">
                { 
                //add conditional logic based on isLoggedIn variable with different links to access
                //if isloggedin is true, it displays the following react fragments. 
                isLoggedIn ? (
                <> 
                <Link to = "/my-bookings">My Bookings </Link>
                <Link to = "/my-hotels">My Hotels </Link>
                <button>
                    Sign out
                </button>
                </>) :  (<Link to = "/sign-in" className = "flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100 hover:text-black-500">
                Sign In
            </Link> )
                }
           
            </span>
        </div>
        </div>
    );
    
};

export default Header; // specific value/object that is primary module export. 