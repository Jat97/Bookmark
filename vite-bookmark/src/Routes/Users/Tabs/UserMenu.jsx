import {Link} from 'react-router-dom';
import {useLogOutMutation} from '../Functions/Mutations/UserMutations';
import {useBookStore} from '../../Context/bookStore';

const UserMenu = (props) => {
    const user = props.props;

    const setSiteError = useBookStore((state) => state.setSiteError);

    const logout_mutation = useLogOutMutation(setSiteError);

    const endSession = () => {
        logout_mutation.mutate();
    }

    return (
        <div>
            <Link to={`/api/user/${user.id}`}> 
                Profile 
            </Link>

            <Link to={`/api/user/friends/${user.id}`}>
                View friends
            </Link>

            <Link to={`/api/user/groups/${user.id}`}> 
                Groups
            </Link>

            <Link to={`/api/users`}>
                View all users
            </Link>

            <Link to={`/api/groups`}>
                View all groups
            </Link>

            <button type='button' onClick={() => endSession()}>
                Logout
            </button>
        </div>
    ) 
}   

export default UserMenu;