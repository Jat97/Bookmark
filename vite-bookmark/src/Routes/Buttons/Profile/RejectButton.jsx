import {useRejectRequestMutation} from "../../Functions/Mutations/FriendMutations";
import {useGroupRejectMutation} from "../../Functions/Mutations/GroupMutations";
import {useBookStore} from '../../../Context/bookStore';

const RejectButton = ({user_group}) => {
    const setSiteError = useBookStore((state) => state.setSiteError);

    const friend_reject_mutation = useRejectRequestMutation([user_group.id, setSiteError]);

    const group_reject_mutation = useGroupRejectMutation([user_group.id, setSiteError]);

    const rejectRequest = () => {
        if(user_group.first_name) {
            return friend_reject_mutation.mutate();
        }
        else {
            return group_reject_mutation.mutate();
        }
    }

    return (
        <button id='reject' data-testid={`reject-${user_group?.id}`} className='cursor-pointer font-semibold bg-red-300/50  
            rounded-full w-[100px] hover:bg-pink-100'
            onClick={() => rejectRequest()}>
            Reject
        </button>
    )
}

export default RejectButton;