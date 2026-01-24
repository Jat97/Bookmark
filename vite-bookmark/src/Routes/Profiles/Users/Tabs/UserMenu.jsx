import {Link, useNavigate} from 'react-router-dom';
import {useLogOutMutation} from '../../../Functions/Mutations/UserMutations';
import {useBookStore} from '../../../../Context/bookStore';

const UserMenu = ({user}) => {
    const setCreateGroupTab = useBookStore((state) => state.setCreateGroupTab);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const navigate = useNavigate();

    const logout_mutation = useLogOutMutation([setSiteError, navigate]);

    const enableGroupTab = () => {
        setCreateGroupTab(true);
    }

    const endSession = () => {
        logout_mutation.mutate();
    }

    return (
        <div className='absolute flex flex-col items-center gap-1 bg-amber-300/75 
            max-h-[150px] w-[150px] z-30 md:left-[20px] md:max-h-52 md:w-[200px]'>
            <Link to={`/api/profile/${user?.id}`} className='cursor-pointer text-center w-full hover:bg-yellow-100'> 
                Profile 
            </Link>

            <Link to={`/api/profile/${user?.id}#friends`} className='cursor-pointer text-center w-full hover:bg-yellow-100'>
                View friends
            </Link>

            <Link to={`/api/profile/${user?.id}#groups`} className='cursor-pointer text-center w-full hover:bg-yellow-100'> 
                Groups
            </Link>

            <Link to={`/api/index/users`} className='cursor-pointer text-center w-full hover:bg-yellow-100'>
                View all users
            </Link>

            <Link to={`/api/index/groups`} className='cursor-pointer text-center w-full hover:bg-yellow-100'>
                View all groups
            </Link>
            
            <p className='cursor-pointer text-center w-full hover:bg-yellow-100' onClick={() => enableGroupTab()}> 
                Create group 
            </p>

            <button type='button' className='cursor-pointer w-full hover:bg-yellow-100' onClick={() => endSession()}>
                Logout
            </button>
        </div>
    ) 
}   

export default UserMenu;