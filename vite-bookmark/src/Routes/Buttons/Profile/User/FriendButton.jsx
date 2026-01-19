import {UserPlusIcon, UserMinusIcon} from '@heroicons/react/24/solid';
import {useFetchAlerts, useFetchFriends} from '../../../Functions/Queries/UserQueries';
import {useSendFriendRequestMutation, useRemoveFriendMutation} from '../../../Functions/Mutations/FriendMutations';
import {useBookStore} from '../../../../Context/bookStore';

const FriendButton = ({user}) => {
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

    if(alertData.data?.alerts.pending?.some((pending) => pending.id === user.id)) {
        return <p> Pending... </p>
    }
    else {
        return (
            <button id={user?.id} data-testid={user?.id} className={`cursor-pointer font-semibold rounded-full p-1 w-[125px]
                ${friendData.data?.friendslist?.some((friend) => friend.id === user.id) ? 
                'bg-red-200 hover:bg-pink-100' : 'bg-emerald-200 hover:bg-lime-100'}`}
                onClick={() => alertData.data?.pending?.some((pending) => pending.id === user.id) ?
                    null
                :
                    handleFriendMutations()
            }>
                {friendData.data?.friendslist?.some((friend) => friend?.id === user?.id) ?
                        <div className='flex justify-around items-center'>
                            <UserMinusIcon className='h-5 fill-white md:h-6' />
                            Remove friend
                        </div>
                    :
                        <div className='flex justify-around items-center'>
                            <UserPlusIcon className='h-5 fill-white md:h-6' />
                            Add friend
                        </div>
                }
            </button>
        );
    }
};

export default FriendButton;