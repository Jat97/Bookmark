import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {useBookStore} from './Context/bookStore';
import Login from './Routes/Users/LogSign/Login';
import Signup from './Routes/Users/LogSign/Signup';
import Home from './Routes/Feed/Posts/Home';
import Index from './Routes/Users/Index';
import GroupIndex from './Routes/Groups/GroupIndex';
import ProfilePage from './Routes/Pages/ProfilePage';
import FullPost from './Routes/Feed/Posts/FullPost';
import SiteErr from './Routes/Miscellaneous/Text/Errors/SiteErr';

function App() {
    const error = useBookStore((state) => state.error);
    
    return (
        <div className='bg-amber-400/25 h-full'>
            <BrowserRouter>
                <Routes>
                    <Route path='/api/login' element={<Login />}></Route>
                    <Route path='/api/signup' element={<Signup />}></Route>
                    <Route path='/api/home' element={<Home />}></Route>
                    <Route path='/api/index/users' element={<Index />}></Route>
                    <Route path='/api/index/groups' element={<GroupIndex />}></Route>
                    <Route path='/api/profile/:profileid' element={<ProfilePage />}></Route>
                    <Route path='/api/group/:profileid' element={<ProfilePage />}></Route>
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
