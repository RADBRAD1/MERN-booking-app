import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";

// interface describes props expected in the Layout component
interface Props{ 
    children: React.ReactNode;//accepts any react component


}


const Layout = ({children}: Props) => {
    return (
        // first make top level div for our class
        <div className = "flex-col min-h-screen">
            <Header />
            <Hero />
            <div className="container mx-auto">
        <SearchBar />
         </div>
            <div className = "container mx-auto py-10 flex-1">
                {children} 
            </div>
            <Footer/>
             </div>
    );
};


export default Layout;