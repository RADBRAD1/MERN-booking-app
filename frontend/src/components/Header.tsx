import {Link} from "react-router-dom";

//react-router-dom has bindings for using react router on the web


const Header = () => { 
    return(
        <div className = "bg-blue-800 py-6"> 
        <div className = "container mx-auto flex justify-between "> 
            <span className = "text-3x1 text-white font-bold tracking-tight">
                <Link to = "/"> PorttoWesteros.com
                </Link>
            </span>
            <span className = "flex space-x-2">
            <Link to = "/sign-in" className = "flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100 hover:text-black-500">
                Sign In
            </Link>
            </span>
        </div>
        </div>
    );
    
};

export default Header; // specific value/object that is primary module export. 