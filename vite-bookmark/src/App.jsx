import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {useBookStore} from './Context/bookStore';
import Layout from './Layout';
import Login from './Routes/Profiles/Users/LogSign/Login';
import Signup from './Routes/Profiles/Users/LogSign/Signup';
import Home from './Routes/Feed/Posts/Home';
import AllProfiles from './Routes/Profiles/ProfileInformation/AllProfiles';
import ProfilePage from './Routes/Profiles/ProfileInformation/ProfilePage';
import EditProfile from './Routes/Profiles/ProfileInformation/EditProfile';
import FullPost from './Routes/Feed/Posts/FullPost';
import CreateGroup from './Routes/Profiles/Groups/CreateGroup';
import EditGroup from './Routes/Profiles/Groups/EditGroup';
import SiteErr from './Routes/Miscellaneous/Text/Errors/SiteErr';

const App = () => {
    const create_group_tab = useBookStore((state) => state.create_group_tab);
    const error = useBookStore((state) => state.error);
    
    return (
        <div className='h-full'>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path='/api/home' element={<Home />}></Route>
                        <Route path='/api/index/users' element={<AllProfiles />}></Route>
                        <Route path='/api/index/groups' element={<AllProfiles />}></Route>
                        <Route path='/api/profile/:profileid' element={<ProfilePage />}></Route>
                        <Route path='/api/group/:profileid' element={<ProfilePage />}></Route>
                        <Route path='/api/post/:postid/comments' element={<FullPost />}></Route>
                        <Route path='/api/profile/edit' element={<EditProfile />}></Route>
                        <Route path='/api/group/edit' element={<EditGroup />}></Route>
                    </Route>
                    
                    <Route path='/api/login' element={<Login />}></Route>
                    <Route path='/api/signup' element={<Signup />}></Route>
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
