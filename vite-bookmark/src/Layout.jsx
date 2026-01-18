import {Outlet} from 'react-router-dom';
import Navbar from './Routes/Profiles/Users/Navbar';

const Layout = () => {  
    return (
        <>
            <Navbar />
            <Outlet /> 
        </>  
    )  
    
};

export default Layout;