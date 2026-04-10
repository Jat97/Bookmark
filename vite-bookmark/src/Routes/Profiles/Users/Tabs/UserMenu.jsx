import {Link, useNavigate} from 'react-router-dom';
import {XMarkIcon} from '@heroicons/react/24/solid';
import {useLogOutMutation} from '../../../Functions/Mutations/UserMutations';
import {useBookStore} from '../../../../Context/bookStore';
import ProfileDisplay from '../../../Profiles/ProfileInformation/Accounts/ProfileDisplay';

const UserMenu = ({user, alert_count, request_count, disable, is_guest}) => {
    const setGuest = useBookStore((state) => state.setGuest);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const navigate = useNavigate();

    const logout_mutation = useLogOutMutation([navigate, setGuest, setSiteError]);

    const endSession = () => {
        logout_mutation.mutate();
    }

    return (
        <div className='absolute top-0 right-[-10px] flex flex-col items-center gap-y-4 bg-amber-300 h-screen w-[150px] z-20 
            md:bg-amber-300/75 md:top-[50px] md:gap-y-2 md:max-h-[225px] md:w-[200px]'>
            <div className='relative m-8 md:hidden'>
                <XMarkIcon className='absolute top-[-30px] right-[40px] h-8' onClick={disable}/>

                <ProfileDisplay profile={user} is_logged={false} profile_mode='profile' />
            </div>
            
            {!is_guest &&
                <Link to={`/api/user/${user?.id}`} className='cursor-pointer text-center w-full hover:bg-yellow-100'> 
                    Profile 
                </Link>
            }
            
            {!is_guest &&
                <Link to={`/api/profile/${user?.id}/friends`} className='cursor-pointer text-center w-full hover:bg-yellow-100'>
                    View friends
                </Link>
            }
           
            {!is_guest &&
                <Link to='/api/notifications' className='text-center w-full md:hidden'>
                    View {alert_count > 0 && `${alert_count}`} notifications
                </Link>
            }
            
            {!is_guest &&
                <Link to='/api/requests' className='text-center w-full md:hidden'>
                    View {request_count > 0 && request_count} requests
                </Link>
            }
            
            {!is_guest &&
                <Link to={`/api/profile/${user?.id}/groups`} className='cursor-pointer text-center w-full hover:bg-yellow-100'> 
                    Groups
                </Link>
            }
           
            <Link to={'/api/index/users'} className='cursor-pointer text-center w-full hover:bg-yellow-100'>
                View all users
            </Link>

            <Link to={'api/index/groups'} className='cursor-pointer text-center w-full hover:bg-yellow-100'>
                View all groups
            </Link>

            {!is_guest &&
                <Link to={'/api/group/create'} className='cursor-pointer text-center w-full hover:bg-yellow-100' 
                    onClick={() => enableGroupTab()}> 
                    Create group 
                </Link>
            }

            <button type='button' className='cursor-pointer w-full hover:bg-yellow-100' onClick={() => endSession()}>
                Logout
            </button>
        </div>
    ) 
}   

export default UserMenu;