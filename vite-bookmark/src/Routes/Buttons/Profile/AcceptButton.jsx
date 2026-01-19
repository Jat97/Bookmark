import {useAcceptRequestMutation} from "../../Functions/Mutations/FriendMutations";
import {useGroupAcceptMutation} from '../../Functions/Mutations/GroupMutations';
import {useBookStore} from '../../../Context/bookStore';

const AcceptButton = ({user_group}) => {
    const setSiteError = useBookStore((state) => state.setSiteError);

    const friend_accept_mutation = useAcceptRequestMutation([user_group.id, setSiteError]);

    const group_accept_mutation = useGroupAcceptMutation([user_group.id, setSiteError]);

    const acceptRequest = () => {
        if(user_group.first_name) {
            return friend_accept_mutation.mutate();
        }
        else {
            return group_accept_mutation.mutate();
        }
    }

    return (
        <button id='accept' data-testid={`accept-${user_group.id}`} className='cursor-pointer bg-green-200 
            hover:bg-lime-100' 
            onClick={() => acceptRequest()}>
            Accept
        </button>
    )
};

export default AcceptButton;