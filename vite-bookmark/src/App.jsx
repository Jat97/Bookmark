import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {useBookStore} from './Context/bookStore';
import Login from './Routes/Users/LogSign/Login';
import Signup from './Routes/Users/LogSign/Signup';
import Home from './Routes/Feed/Home';
import Index from './Routes/Users/Index';
import GroupIndex from './Routes/Groups/GroupIndex';
import UserPage from './Routes/Users/UserPage';
import GroupInfoPage from './Routes/Groups/GroupInfoPage';
import FullPost from './Routes/Feed/Posts/FullPosts';
import SiteErr from './Routes/Miscellaneous/Text/Errors/SiteErr';

function App() {
    const error = useBookStore((state) => state.error);
    
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path='/api/login' element={<Login />}></Route>
                    <Route path='/api/signup' element={<Signup />}></Route>
                    <Route path='/api/home' element={<Home />}></Route>
                    <Route path='/api/index/users' element={<Index />}></Route>
                    <Route path='/api/index/groups' element={<GroupIndex />}></Route>
                    <Route path='/api/user/:userid' element={<UserPage />}></Route>
                    <Route path='/api/group/:groupid' element={<GroupInfoPage />}></Route>
                    <Route path='/api/post/:postid/comments' element={<FullPost />}></Route>
                    <Route path='*' element={<Navigate to='/api/login' />}></Route>
                </Routes>
            </BrowserRouter>

            {error &&
                <SiteErr props={error} />
            }
        </div>
    )
}

export default App
