import {UserPlusIcon, UserMinusIcon} from '@tanstack/react-query';
import {useFetchAlerts, useFetchFriends} from '../Functions/Queries/UserQueries';
import {useSendFriendRequestMutation, useRemoveFriendMutation} from '../Functions/Mutation/FriendMutation';
import {useSendFriendRequestMutation, useRemoveFriendMutation} from '../Functions/Mutations/AlertMutations';
import {bookStore} from '../../Context/bookStore';

const FriendButton = (props) => {
    const user = props.props;

    const authorized = bookStore((state) => state.authorized);
    const setAuthorized = bookStore((state) => state.setAuthorized);
    const setSiteError = bookStore((state) => state.setSiteError);

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

    return (
        <button onClick={() => 
            alertData.data.pending.some((pending) => pending.id === user.id) ?
                null
            :
                handleFriendMutations()
        }>
            {alertData.data.pending.some((pending) => pending.id === user.id) ? 
                'Pending...'
            :
                friendData.data.friendslist.some((friend) => friend.id === user.id) ?
                    <div>
                        <UserMinusIcon />
                        Remove friend
                    </div>
                :
                    <div>
                        <UserPlusIcon />
                        Add friend
                    </div>
            }
        </button>
    );
};

export default FriendButton;