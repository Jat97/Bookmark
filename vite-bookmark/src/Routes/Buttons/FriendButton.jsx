import {UserPlusIcon, UserMinusIcon} from '@tanstack/react-query';
import {useFetchAlerts, useFetchFriends} from '../Functions/Queries/UserQueries';
import {useSendFriendRequestMutation, useRemoveFriendMutation} from '../Functions/Mutations/FriendMutations';
import {useBookStore} from '../../Context/bookStore';

const FriendButton = (props) => {
    const user = props.props;

    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const alertData = useFetchAlerts([authorized, setAuthorized, setSiteError]);
    const friendData = useFetchFriends([authorized, setAuthorized, setSiteError]);

    const request_mutation = useSendFriendRequestMutation([user, setSiteError]);
    const remove_mutation = useRemoveFriendMutation([user, setSiteError]);

    const handleFriendMutations = () => {
        if(friendData.data.friendslist.some((friend) => friend.id === user.id)) {
            return remove_mutation.mutate();
        }
        else {
            return request_mutation.mutate();
        }
    }

    if(alertData.data.pending.some((pending) => pending.id === user.id)) {
        return <p> Pending... </p>
    }
    else {
        return (
            <button id={user.id} data-testid={user.id} className={`rounded-full p-1 max-w-20
                ${friendData.data.friendslist.some((friend) => friend.id === user.id) ? 
                'bg-red-200 hover:bg-pink-100' : 'bg-emerald-200 hover:bg-lime-100'}`}
            onClick={() => alertData.data.pending.some((pending) => pending.id === user.id) ?
                null
            :
                handleFriendMutations()
            }>
                {friendData.data.friendslist.some((friend) => friend.id === user.id) ?
                        <div className='flex justify-around items-center'>
                            <UserMinusIcon className='h-6 fill-white' />
                            Remove friend
                        </div>
                    :
                        <div className='flex justify-around items-center'>
                            <UserPlusIcon className='h-6 fill-white' />
                            Add friend
                        </div>
                }
            </button>
        );
    }
};

export default FriendButton;