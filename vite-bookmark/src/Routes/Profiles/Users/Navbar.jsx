import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {BellIcon, ChatBubbleOvalLeftEllipsisIcon, MagnifyingGlassIcon, UserIcon} from '@heroicons/react/24/solid';
import {useFetchLogged, useFetchAlerts, useFetchUsers} from '../../Functions/Queries/UserQueries';
import {useFetchGroups} from '../../Functions/Queries/GroupQueries';
import {useFetchChats} from '../../Functions/Queries/ChatQueries';
import {useBookStore} from '../../../Context/bookStore';
import UserMenu from './Tabs/UserMenu';
import AlertTab from './Tabs/AlertTab';
import ChatBox from '../../Chats/ChatBox';
import NotificationCount from '../../Miscellaneous/Text/NotificationCount';
import ProfileDisplay from '../ProfileInformation/ProfileDisplay';

const Navbar = () => {
    const selected_chat = useBookStore((state) => state.selected_chat);
    const authorized = useBookStore((state) => state.authorized);
    const setSelectedChat = useBookStore((state) => state.setSelectedChat);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const [userMenu, setUserMenu] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    const [alertTabs, setAlertTabs] = useState({
        notifications: false,
        requests: false
    });

    const loggedData = useFetchLogged([authorized, setAuthorized, setSiteError]);
    const alertData = useFetchAlerts([authorized, setAuthorized, setSiteError]);
    const chatData = useFetchChats([authorized, setAuthorized, setSiteError]);
    const userData = useFetchUsers([authorized, setAuthorized, setSiteError]);
    const groupData = useFetchGroups([authorized, setAuthorized, setSiteError]);

    useEffect(() => {
        chatData.data?.chats.forEach(chat => {
            const unread_messages = chat.messages.filter(message => message.checked === false 
                && message.sending_user !== loggedData.data?.logged_user.profile.id);

            setUnreadMessageCount(unreadMessageCount + unread_messages.length);
        });
    }, [chatData, loggedData, unreadMessageCount]);

    const toggleUserMenu = () => {
        setUserMenu(userMenu ? false : true);
    }

    const searchUsersGroups = (e) => {
        const accounts_and_groups = userData.data?.users.concat(groupData.data.groups)
            .sort((a, b) => a.first_name > b.first_name || a.title > b.title ? 1 : -1);
        
        const reg = new RegExp(e.target.value, 'i');

        if(e.target.value === '') {
            setSearchData('');
        }
        else {
            accounts_and_groups?.filter(item => (reg.test(item.first_name) || reg.test(item.last_name)) || reg.test(item.title));
            setSearchData(accounts_and_groups);
        }
    };

    const openNavChat = () => {
        setSelectedChat(chatData.data.chats[0]?.chat.user);
    }

    const handleNotificationTab = () => {
        setAlertTabs({
            notiifcations: alertTabs.notifications ? false : true,
            requests: false
        });
    }

    const handleRequestsTab = () => {
        setAlertTabs({
            notifications: false,
            requests: alertTabs.requests ? false : true
        });
    }

    return (
        <div className='flex justify-evenly items-center bg-amber-300/75 w-screen'>
            <Link to='/api/home' className='text-center text-sm font-semibold md:text-xl'> Bookmark </Link>
            
            <div className='relative'>
                <form method='GET' action='/api/search' encType='application/json' className='flex justify-start 
                    items-center'>
                    <input type='search' name='query' className='bg-slate-100 rounded-tl-full rounded-bl-full 
                        p-1 w-[350px] focus:bg-white' placeholder='What are you looking for?' 
                        onChange={(e) => searchUsersGroups(e)}>
                    </input>

                    <button type='submit' className='flex flex-col items-center border-slate-100 rounded-tr-full 
                        rounded-br-full bg-white p-1 w-[50px]'>
                        <MagnifyingGlassIcon className='h-6 fill-orange-300' />
                    </button>
                </form>

                {searchData?.length > 0 &&
                    <div className='absolute flex flex-col items-center gap-1 border border-slate-200 bg-orange-300 
                        max-h-[350px] w-[350px] z-50'>
                        {searchData.map(user => {
                            return <ProfileDisplay profile={user} is_logged={false} profile_mode={'search'} />
                        })}
                    </div>
                }
            </div>
            
            <div className='flex justify-around items-center w-1/6'>
                <div className='relative'>
                    <button type='button' className='relative flex flex-row-reverse items-end hover:bg-amber-100' 
                        onClick={() => handleNotificationTab()}>
                        <BellIcon className='h-6' />

                        <NotificationCount count={alertData.data?.alerts.notifications.length} />
                    </button>

                    {alertTabs.notifications &&
                        <AlertTab alerts={alertData.data?.alerts.notifications || []} />
                    }
                </div>
                
                <button type='button' className='relative flex flex-row-reverse items-end hover:bg-amber-100' 
                    onClick={() => openNavChat()}>
                    <ChatBubbleOvalLeftEllipsisIcon className='h-6' />

                    <NotificationCount count={unreadMessageCount} />
                </button>

                <div className='relative'>
                    <button className='flex flex-col-reverse items-end hover:bg-amber-100' 
                        onClick={() => handleRequestsTab()}>
                       <UserIcon className='h-6' /> 

                       <NotificationCount count={alertData.data?.alerts.requests?.length} />
                    </button>

                    {alertTabs.requests &&
                        <AlertTab alerts={alertData.data?.alerts.requests || []} />
                    }
                </div>
            </div>

            <div className='relative' >
                <div onClick={() => toggleUserMenu()}>
                    <ProfileDisplay profile={loggedData.data?.logged_user?.profile} is_logged={true} profile_mode={'navbar'} />
                </div>

                {userMenu &&
                    <UserMenu user={loggedData.data?.logged_user?.profile} />
                }
            </div>

            {selected_chat !== null &&
                <ChatBox chats={chatData.data?.chats} />
            }
        </div>
    )
}

export default Navbar;