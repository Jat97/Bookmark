import {UserPlusIcon, UserMinusIcon} from '@heroicons/react/24/solid';
import {useFetchAlerts} from '../../../Functions/Queries/UserQueries';
import {useSendFriendRequestMutation, useRemoveFriendMutation} from '../../../Functions/Mutations/FriendMutations';
import {useBookStore} from '../../../../Context/bookStore';
import Pending from '../../../Miscellaneous/Text/Pending';

const FriendButton = ({logged, user}) => {
    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const alertData = useFetchAlerts([authorized, setAuthorized, setSiteError]);

    const request_mutation = useSendFriendRequestMutation(setSiteError);
    const remove_mutation = useRemoveFriendMutation(setSiteError);

    const handleFriendMutations = () => {
        if(logged.friends.some((friend) => friend.id === user.id)) {
            return remove_mutation.mutate({userid: user.id});
        }
        else {
            return request_mutation.mutate({user: user});
        }
    }

    if(alertData.data?.pending?.some((pending) => pending.id === user.id)) {
        return <Pending />
    }
    else {
        return (
            <button id={user?.id} data-testid={user?.id} className={`cursor-pointer font-semibold rounded-full p-1 
                w-[150px]
                ${logged?.friends?.some((friend) => friend?.id === user?.id) ? 
                'bg-red-200 hover:bg-pink-100' : 'bg-emerald-200 hover:bg-lime-100'}`}
                onClick={() => alertData.data?.pending?.some((pending) => pending.id === user.id) ?
                    null
                :
                    handleFriendMutations()
            }>
                {logged?.friends?.some((friend) => friend?.id === user?.id) ?
                        <div className='flex justify-around items-center w-full'>
                            <UserMinusIcon className='h-5 fill-white md:h-6' />
                            Remove friend
                        </div>
                    :
                        <div className='flex justify-around items-center w-full'>
                            <UserPlusIcon className='h-5 fill-white md:h-6' />
                            Add friend
                        </div>
                }
            </button>
        );
    }
};

export default FriendButton;