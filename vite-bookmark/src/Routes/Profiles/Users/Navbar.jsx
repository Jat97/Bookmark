import {useState, useMemo} from 'react';
import {Link} from 'react-router-dom';
import {BellIcon, ChatBubbleOvalLeftEllipsisIcon, MagnifyingGlassIcon, UserIcon} from '@heroicons/react/24/solid';
import {useFetchLogged, useFetchAlerts, useFetchUsers} from '../../Functions/Queries/UserQueries';
import {useFetchGroups} from '../../Functions/Queries/GroupQueries';
import {useCheckNotificationMutation} from '../../Functions/Mutations/UserMutations';
import {useBookStore} from '../../../Context/bookStore';
import ProfileDisplay from '../../Profiles/ProfileInformation/Accounts/ProfileDisplay';
import UserMenu from './Tabs/UserMenu';
import AlertTab from './Tabs/AlertTab';
import NotificationCount from '../../Miscellaneous/Text/NotificationCount';
import NavbarLoad from '../../Miscellaneous/Loading/Profiles/Users/NavbarLoad';

const Navbar = () => {
    const is_guest = useBookStore((state) => state.is_guest);
    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const [userMenu, setUserMenu] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [alertTabs, setAlertTabs] = useState({
        notifications: false,
        requests: false
    });

    const loggedData = !is_guest && useFetchLogged([authorized, setAuthorized, setSiteError]);
    const alertData = !is_guest && useFetchAlerts([authorized, setAuthorized, setSiteError]);
    const userData = !is_guest && useFetchUsers([authorized, setAuthorized, setSiteError]);
    const groupData = !is_guest && useFetchGroups([authorized, setAuthorized, setSiteError]);

    const check_mutation = useCheckNotificationMutation(setSiteError);

    const uncheckedNotifications = useMemo(() => {
        if(!alertData.data?.notifications.some(alert => !alert.checked)) {
            return 0
        }
        else {
            const unchecked = alertData.data.notifications.filter(alert => !alert.checked).length;

            return unchecked;
        }
    })

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
            accounts_and_groups?.filter(item => (reg.test(item.first_name) || reg.test(item.title)));
            setSearchData(accounts_and_groups);
        }
    };

    const handleNotificationTab = () => {
        setAlertTabs({
            notifications: alertTabs.notifications ? false : true,
            requests: false
        });
        
        if(uncheckedNotifications > 0) {
           check_mutation.mutate(); 
        }
    }

    const handleRequestsTab = () => {
        setAlertTabs({
            notifications: false,
            requests: alertTabs.requests ? false : true
        });
    }

    if(loggedData.isPending) {
        return <NavbarLoad />
    }   
    else {
        return (
            <div className='grid grid-cols-3 items-center bg-amber-300/75 p-1 w-screen md:flex md:justify-evenly'>
                <Link to='/api/home' className='text-center text-base font-semibold md:text-xl'> Bookmark </Link>
                
                <div className='relative'>
                    <form method='GET' action='/api/search' encType='application/json' className='flex justify-start 
                        items-center'>
                        <input type='search' name='query' className='bg-slate-100 rounded-tl-full rounded-bl-full 
                            w-[200px] md:p-1 md:w-[350px] focus:bg-white' placeholder='What are you looking for?' 
                            onChange={(e) => searchUsersGroups(e)}>
                        </input>

                        <button type='submit' className='flex flex-col items-center border-slate-100 rounded-tr-full 
                            rounded-br-full bg-white w-[25px] md:p-1 md:w-[50px]'>
                            <MagnifyingGlassIcon className='h-6 fill-orange-300' />
                        </button>
                    </form>

                    {searchData?.length > 0 &&
                        <div className='absolute flex flex-col items-center gap-1 border border-slate-200 bg-orange-300 
                            max-h-[350px] w-[350px] z-20'>
                            {searchData.map(user => {
                                return <ProfileDisplay profile={user} is_logged={false} profile_mode={'search'} />
                            })}
                        </div>
                    }
                </div>

                {!is_guest &&
                    <div className='hidden md:flex md:justify-around md:items-center md:w-1/6'>
                        <div className='relative'>
                            <button type='button' className='relative flex flex-row-reverse items-end hover:bg-amber-100' 
                                onClick={() => handleNotificationTab()}>
                                <BellIcon className='h-4 md:h-6' />

                                <NotificationCount count={uncheckedNotifications} />
                            </button>

                            {alertTabs?.notifications &&
                                <AlertTab alerts={alertData.data?.notifications || []} />
                            }
                        </div>
                        
                        <Link to='/api/chats' className='relative flex flex-row-reverse items-end hover:bg-amber-100'>
                            <ChatBubbleOvalLeftEllipsisIcon className='h-4 md:h-6' />
                        </Link>

                        <div className='relative'>
                            <button className='flex flex-col-reverse items-end hover:bg-amber-100' 
                                onClick={() => handleRequestsTab()}>
                                <UserIcon className='h-4 md:h-6' /> 

                                <NotificationCount count={alertData.data?.requests?.length} />
                            </button>

                            {alertTabs.requests &&
                                <AlertTab alerts={alertData.data?.requests || []} />
                            }
                        </div>
                    </div>
                }

                <div className='relative' onClick={() => toggleUserMenu()}>
                    <ProfileDisplay profile={loggedData.data?.profile} is_logged={true} profile_mode={'navbar'} />

                    <div className='md:hidden'>
                        <NotificationCount count={uncheckedNotifications} />
                    </div>

                    {userMenu &&
                        <UserMenu 
                            user={loggedData.data?.profile} 
                            alert_count={uncheckedNotifications} 
                            request_count={alertData.data.requests.length}
                            disable={toggleUserMenu} 
                            is_guest={is_guest}
                        />
                    }
                </div>
            </div>
        )
    }    
}

export default Navbar;