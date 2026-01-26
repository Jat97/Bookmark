import {useGroupRequestMutation, useLeaveGroupMutation} from "../../../Functions/Mutations/GroupMutations";
import {useBookStore} from '../../../../Context/bookStore';

const GroupRequestLeaveButton = ({logged, group, is_member}) => {
    const setSiteError = useBookStore((state) => state.setSiteError);

    const group_request_mutation = useGroupRequestMutation([logged, group, setSiteError]);
    const group_leave_mutation = useLeaveGroupMutation([logged, group, setSiteError]);

    const handleGroupMutations = () => {
        if(is_member) {
            return group_leave_mutation.mutate();
        }
        else {
            return group_request_mutation.mutate();
        }
    }

    return (
        <button type='button' data-testid={'group_membership_button'} className={`curser-pointer font-semibold rounded-full 
            w-[150px] hover:bg-pink-100 ${is_member ? 'bg-red-400/50' : 'bg-violet-400/50'}`}
            onClick={() => handleGroupMutations()}>
            {is_member ?
                'Leave group'
            :
                'Request to join'
            }
        </button>
    )
};  

export default GroupRequestLeaveButton;