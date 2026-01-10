import {useState, useEffect} from 'react';
import {BellIcon, ChatBubbleOvalLeftEllipsisIcon, MagnifyingGlassIcon, UserIcon} from '@heroicons/react/24/solid';
import {useFetchLogged, useFetchAlerts, useFetchUsers} from '../../Functions/Queries/UserQueries';
import {useFetchGroups} from '../../Functions/Queries/GroupQueries';
import {useFetchChats} from '../../Functions/Queries/ChatQueries';
import {useBookStore} from '../../../Context/bookStore';
import UserMenu from './Tabs/UserMenu';
import AlertTab from './Tabs/AlertTab';
import ChatBox from '../../Chats/ChatBox';
import PageHeader from '../../Miscellaneous/Text/PageHeader';
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
                && message.sending_user !== loggedData.data?.logged_user.id);

            setUnreadMessageCount(unreadMessageCount + unread_messages.length);
        });
    }, [chatData, loggedData, unreadMessageCount]);

    const toggleUserMenu = () => {
        setUserMenu(userMenu ? false : true);
    }

    const searchUsersGroups = (e) => {
        const accounts_and_groups = userData.data.users.concat(groupData.data.groups)
            .sort((a, b) => a.first_name > b.first_name || a.title > b.title ? 1 : -1);
        
        const reg = new RegExp(e.target.value, 'i');

        if(e.target.value === '') {
            setSearchData('');
        }
        else {
            accounts_and_groups.filter(item => (reg.test(item.first_name) || reg.test(item.last_name)) || reg.test(item.title));
            setSearchData(accounts_and_groups);
        }
    };

    const openNavChat = () => {
        setSelectedChat(chatData.data.chats[0].chat.user);
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
        <div className='fixed top-0 flex justify-evenly items-center bg-orange-300'>
            <PageHeader props={'Bookmark'} />
            
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

                {searchData.length > 0 &&
                    <div className='absolute flex flex-col items-center gap-1 border border-slate-200 bg-orange-300 w-[350px] z-50'>
                        {searchData.map(user => {
                            return <UserDisplay props={[user, false, 'search']} />
                        })}
                    </div>
                }
            </div>
            
            <div className='flex justify-around items-center w-1/6'>
                <div>
                    <button type='button' className='flex flex-row-reverse items-end hover:bg-amber-100' 
                        onClick={() => handleNotificationTab()}>
                        <BellIcon className='h-6' />

                        <NotificationCount props={alertData.data?.alerts.length} />
                    </button>

                    {alertTabs.notifications &&
                        <AlertTab props={alertData.data?.alerts || []} />
                    }
                </div>
                
                <button type='button' className='flex flex-row-reverse items-end hover:bg-amber-100' 
                    onClick={() => openNavChat()}>
                    <ChatBubbleOvalLeftEllipsisIcon className='h-6' />

                    <NotificationCount props={unreadMessageCount} />
                </button>

                <div>
                    <button className='flex flex-row-reverse items-end hover:bg-amber-100' 
                        onClick={() => handleRequestsTab()}>
                       <UserIcon className='h-6' /> 

                       <NotificationCount props={alertData.data?.requests?.length} />
                    </button>

                    {alertTabs.requests &&
                        <AlertTab props={alertData.data?.requests || []} />
                    }
                </div>
            </div>

            <div className='relative' onClick={() => toggleUserMenu()}>
                <ProfileDisplay props={[loggedData.data?.logged_user, true, 'navbar']} />

                {userMenu &&
                    <UserMenu props={loggedData.data?.logged_user} />
                }
            </div>

            {selected_chat !== null &&
                <ChatBox props={chatData.data?.chats} />
            }
        </div>
    )
}

export default Navbar;