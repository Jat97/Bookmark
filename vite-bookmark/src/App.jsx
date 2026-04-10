import {useEffect} from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {useBookStore} from './Context/bookStore';
import Layout from './Layout';
import Login from './Routes/Profiles/Users/LogSign/Login';
import Signup from './Routes/Profiles/Users/LogSign/Signup';
import Home from './Routes/Feed/Posts/Home';
import AllProfiles from './Routes/Profiles/ProfileInformation/Accounts/AllProfiles';
import ProfilePage from './Routes/Profiles/ProfileInformation/Accounts/ProfilePage';
import EditProfile from './Routes/Profiles/ProfileInformation/Accounts/EditProfile';
import FullPost from './Routes/Feed/Posts/FullPost';
import CreateGroup from './Routes/Profiles/Groups/CreateGroup';
import EditGroup from './Routes/Profiles/Groups/EditGroup';
import ChatBox from './Routes/Chats/ChatBox';
import ActiveChat from './Routes/Chats/ActiveChat';
import AlertPage from './Routes/Profiles/ProfileInformation/Alerts/AlertPage';
import SavePopup from './Routes/Miscellaneous/Text/SavePopup';
import SiteErr from './Routes/Miscellaneous/Text/Errors/SiteErr';

const App = () => {
    const popup = useBookStore((state) => state.popup);
    const setPopup = useBookStore((state) => state.setPopup);
    const error = useBookStore((state) => state.error);

    useEffect(() => {
        setInterval(() => {
            if(popup) {
                setPopup(false);
            }
        }, 10000)
    }, [popup]);
    
    return (
        <div className='h-screen'>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path='/api/home' element={<Home />}></Route>
                        <Route path='/api/index/users' element={<AllProfiles />}></Route>
                        <Route path='/api/index/groups' element={<AllProfiles />}></Route>
                        <Route path='/api/profile/:profileid/friends' element={<AllProfiles />}></Route>
                        <Route path='/api/profile/:profileid/groups' element={<AllProfiles />}></Route>
                        <Route path='/api/group/:profileid/members' element={<AllProfiles />}></Route>
                        <Route path='/api/group/:profileid/requests' element={<AllProfiles />}></Route>
                        <Route path='/api/search' element={<AllProfiles />}></Route>
                        <Route path='/api/user/:profileid' element={<ProfilePage />}></Route>
                        <Route path='/api/group/:profileid' element={<ProfilePage />}></Route>
                        <Route path='/api/post/:postid/comments' element={<FullPost />}></Route>
                        <Route path='/api/group/create' element={<CreateGroup />}></Route>
                        <Route path='/api/profile/edit' element={<EditProfile />}></Route>
                        <Route path='/api/group/:groupid/edit' element={<EditGroup />}></Route>
                        <Route path='/api/chats' element={<ChatBox />}></Route>
                        <Route path='/api/chat/:userid' element={<ChatBox />}></Route>
                        <Route path='/api/notifications' element={<AlertPage />}></Route>
                        <Route path='/api/requests' element={<AlertPage />}></Route>
                    </Route>
                    
                    <Route path='/api/login' element={<Login />}></Route>
                    <Route path='/api/signup' element={<Signup />}></Route>
                    <Route path='*' element={<Navigate to='/api/login' />}></Route>
                </Routes>
            </BrowserRouter>

            {popup &&
                <SavePopup />
            }

            {error &&
                <SiteErr error={error} />
            }
        </div>
    )
}

export default App
