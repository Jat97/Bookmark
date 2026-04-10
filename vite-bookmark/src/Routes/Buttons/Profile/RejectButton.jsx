import {useRejectRequestMutation} from "../../Functions/Mutations/FriendMutations";
import {useGroupRejectMutation} from "../../Functions/Mutations/GroupMutations";
import {useBookStore} from '../../../Context/bookStore';

const RejectButton = ({user, group}) => {
    const setSiteError = useBookStore((state) => state.setSiteError);

    const friend_reject_mutation = useRejectRequestMutation(setSiteError);

    const group_reject_mutation = useGroupRejectMutation(setSiteError);

    const rejectRequest = () => {
        if(group) {
            return group_reject_mutation.mutate({group: group, user: user});   
        }
        else {
            return friend_reject_mutation.mutate({userid: user.id});
        }
    }

    return (
        <button id='reject' data-testid={`reject-${user?.id}`} className='cursor-pointer font-semibold text-sm 
            bg-red-300/50 rounded-full w-[75px] hover:bg-pink-100'
            onClick={() => rejectRequest()}>
            Reject
        </button>
    )
}

export default RejectButton;