import {Link} from 'react-router-dom';
import {useLogOutMutation} from '../../Functions/Mutations/UserMutations';
import {useBookStore} from '../../../Context/bookStore';

const UserMenu = (props) => {
    const user = props.props;

    const setSiteError = useBookStore((state) => state.setSiteError);

    const logout_mutation = useLogOutMutation(setSiteError);

    const endSession = () => {
        logout_mutation.mutate();
    }

    return (
        <div className='absolute flex flex-col items-center gap-1 bg-orange-300 
            max-h-[150px] w-[150px] md:left-[20px] md:max-h-52 md:w-[200px]'>
            <Link to={`/api/profile/${user?.id}`} className='cursor-pointer text-center w-full hover:bg-amber-100'> 
                Profile 
            </Link>

            <Link to={`/api/user/friends/${user?.id}`} className='cursor-pointer text-center w-full hover:bg-amber-100'>
                View friends
            </Link>

            <Link to={`/api/user/groups/${user?.id}`} className='cursor-pointer text-center w-full hover:bg-amber-100'> 
                Groups
            </Link>

            <Link to={`/api/index/users`} className='cursor-pointer text-center w-full hover:bg-amber-100'>
                View all users
            </Link>

            <Link to={`/api/index/groups`} className='cursor-pointer text-center w-full hover:bg-amber-100'>
                View all groups
            </Link>

            <button type='button' className='cursor-pointer w-full hover:bg-amber-100' onClick={() => endSession()}>
                Logout
            </button>
        </div>
    ) 
}   

export default UserMenu;