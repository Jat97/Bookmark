import {useRejectRequestMutation} from "../../Functions/Mutations/FriendMutations";
import {useGroupRejectMutation} from "../../Functions/Mutations/GroupMutations";
import {useBookStore} from '../../../Context/bookStore';

const RejectButton = ({user_group}) => {
    const setSiteError = useBookStore((state) => state.setSiteError);

    const friend_reject_mutation = useRejectRequestMutation([user_group, setSiteError]);

    const group_reject_mutation = useGroupRejectMutation([user_group, setSiteError]);

    const rejectRequest = () => {
        if(user_group.first_name) {
            return friend_reject_mutation.mutate();
        }
        else {
            return group_reject_mutation.mutate();
        }
    }

    return (
        <button id='reject' data-testid={`reject-${id}`} className='bg-red-200 cursor-pointer hover:bg-pink-100'
            onClick={() => rejectRequest()}>
            Reject
        </button>
    )
}

export default RejectButton;