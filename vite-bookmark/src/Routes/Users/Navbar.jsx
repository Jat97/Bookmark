import {useState, useEffect} from 'react';
import {BellIcon, ChatBubbleOvalLeftEllipsisIcon, MagnifyingGlassIcon, UserIcon} from '@heroicons/react/24/solid';
import {useFetchLogged, useFetchAlerts, useFetchUsers} from '../Functions/Queries/UserQueries';
import {useFetchGroups} from '../Functions/Queries/GroupQueries';
import {useFetchChats} from '../Functions/Queries/ChatQueries';
import {useBookStore} from '../../Context/bookStore';
import UserDisplay from './UserDisplay';
import UserMenu from './Tabs/UserMenu';
import AlertTab from './Tabs/AlertTab';
import PageHeader from '../Miscellaneous/Text/PageHeader';

const Navbar = () => {
    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const [userMenu, setUserMenu] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);

    const loggedData = useFetchLogged([authorized, setAuthorized, setSiteError]);
    const alertData = useFetchAlerts([authorized, setAuthorized, setSiteError]);
    const chatData = useFetchChats([authorized, setAuthorized, setSiteError]);
    const userData = useFetchUsers([authorized, setAuthorized, setSiteError]);
    const groupData = useFetchGroups([authorized, setAuthorized, setSiteError]);

    useEffect(() => {
        chatData.data.chats.forEach(chat => {
            const unread_messages = chat.messages.filter(message => message.checked === false 
                && message.sending_user !== loggedData.data.logged_user.id);

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

    return (
        <div className='flex justify-between items-center'>
            <PageHeader props={'Bookmark'} />
            
            <form method='GET' action='/api/search' encType='application/json'>
                <input type='search' name='query' className='bg-slate-100 p-1 max-w-32 focus:bg-white' 
                    placeholder='What are you looking for?' onChange={(e) => searchUsersGroups(e)}>
                </input>

                <button type='submit' className='border-slate-100 p-1'>
                    <MagnifyingGlassIcon className='h-6' />
                </button>
            </form>
            
            <div className='flex justify-around items-center'>
                <div>
                    <div className='flex flex-row-reverse items-end'>
                        <BellIcon className='h-6' />

                        <NotificationCount props={alertData.data.alerts.length} />
                    </div>
                    
                    <AlertTab props={alertData.data.alerts} />
                </div>
                
                <div className=''>
                    <div className='flex flex-row-reverse items-end'>
                        <ChatBubbleOvalLeftEllipsisIcon className='h-6' />

                        <NotificationCount props={unreadMessageCount} />
                    </div>
                </div>

                <div className=''>
                    <div className='flex flex-row-reverse items-end'>
                       <UserIcon className='h-6' /> 

                       <NotificationCount props={alertData.data.requests.length} />
                    </div>

                    <AlertTab props={alertData.data.requests} />
                </div>
            </div>

            <div onClick={() => toggleUserMenu()}>
                <UserDisplay props={[loggedData.data.logged_user, '']} />

                {userMenu &&
                    <UserMenu props={loggedData.data.logged_user} />
                }
            </div>
        </div>
    )
}

export default Navbar;