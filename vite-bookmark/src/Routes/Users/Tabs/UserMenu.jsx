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
        <div className='flex flex-col items-center border border-slate-200 bg-slate-200 max-h-40 max-w-32'>
            <Link to={`/api/user/${user.id}`} className='hover:bg-zinc-100'> 
                Profile 
            </Link>

            <Link to={`/api/user/friends/${user.id}`} className='hover:bg-zinc-100'>
                View friends
            </Link>

            <Link to={`/api/user/groups/${user.id}`} className='hover:bg-zinc-100'> 
                Groups
            </Link>

            <Link to={`/api/users`} className='hover:bg-zinc-100'>
                View all users
            </Link>

            <Link to={`/api/groups`} className='hover:bg-zinc-100'>
                View all groups
            </Link>

            <button type='button' className='hover:bg-zinc-100' onClick={() => endSession()}>
                Logout
            </button>
        </div>
    ) 
}   

export default UserMenu;