import {useAcceptRequestMutation} from "../../Functions/Mutations/FriendMutations";
import {useGroupAcceptMutation} from '../../Functions/Mutations/GroupMutations';
import {useBookStore} from '../../../Context/bookStore';

const AcceptButton = ({user, group}) => {
    const setSiteError = useBookStore((state) => state.setSiteError);

    const friend_accept_mutation = useAcceptRequestMutation(setSiteError);

    const group_accept_mutation = useGroupAcceptMutation(setSiteError);

    const acceptRequest = () => {
        if(group) {
            return group_accept_mutation.mutate({group: group, user: user});
        }
        else {
           return friend_accept_mutation.mutate({user: user});
        }
    }

    return (
        <button id='accept' data-testid={`accept-${user?.id}`} className='cursor-pointer font-semibold text-sm 
            bg-green-300/50 rounded-full w-[75px] hover:bg-lime-100' 
            onClick={() => acceptRequest()}>
            Accept
        </button>
    )
};

export default AcceptButton;