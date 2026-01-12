import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {useBookStore} from './Context/bookStore';
import Login from './Routes/Profiles/Users/LogSign/Login';
import Signup from './Routes/Profiles/Users/LogSign/Signup';
import Home from './Routes/Feed/Posts/Home';
import Index from './Routes/Profiles/ProfileInformation/Index';
import ProfilePage from './Routes/Profiles/ProfileInformation/ProfilePage';
import FullPost from './Routes/Feed/Posts/FullPost';
import CreateGroup from './Routes/Profiles/Groups/CreateGroup';
import SiteErr from './Routes/Miscellaneous/Text/Errors/SiteErr';
import Navbar from './Routes/Profiles/Users/Navbar';

const App = () => {
    const create_group_tab = useBookStore((state) => state.create_group_tab);
    const error = useBookStore((state) => state.error);
    
    return (
        <div className='bg-amber-400/25 h-full'>
            <Navbar />
            
            <BrowserRouter>
                <Routes>
                    <Route path='/api/login' element={<Login />}></Route>
                    <Route path='/api/signup' element={<Signup />}></Route>
                    <Route path='/api/home' element={<Home />}></Route>
                    <Route path='/api/index/users' element={<Index />}></Route>
                    <Route path='/api/index/groups' element={<Index />}></Route>
                    <Route path='/api/profile/:profileid' element={<ProfilePage />}></Route>
                    <Route path='/api/group/:profileid' element={<ProfilePage />}></Route>
                    <Route path='/api/post/:postid/comments' element={<FullPost />}></Route>
                    <Route path='*' element={<Navigate to='/api/login' />}></Route>
                </Routes>
            </BrowserRouter>

            {create_group_tab &&
                <CreateGroup />
            }

            {error &&
                <SiteErr error={error} />
            }
        </div>
    )
}

export default App
