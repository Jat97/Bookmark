import {useGroupRequestMutation, useLeaveGroupMutation} from "../../../Functions/Mutations/GroupMutations";
import {useBookStore} from '../../../../Context/bookStore';
import Pending from '../../../Miscellaneous/Text/Pending';

const GroupRequestLeaveButton = ({logged, group}) => {
    const setSiteError = useBookStore((state) => state.setSiteError);

    const group_request_mutation = useGroupRequestMutation(setSiteError);
    const group_leave_mutation = useLeaveGroupMutation(setSiteError);

    const handleGroupMutations = () => {
        if(group.members.some((member) => member.id === logged.id)) {
            return group_leave_mutation.mutate({group: group});
        }
        else {
            return group_request_mutation.mutate({group: group});
        }
    }

    if(group.requests.some((request) => request.id === logged.id)) {
        return <Pending />
    }
    return (
        <button type='button' data-testid={'group_membership_button'} className={`curser-pointer font-semibold rounded-full 
            w-[150px] hover:bg-pink-100 ${group.members.some((member) => member.id === logged.id) ? 
                    'bg-red-400/50' : 'bg-violet-400/50'}`
            }
            onClick={() => handleGroupMutations()}>
            {group.members.some((member) => member.id === logged.id) ?
                'Leave group'
            :
                'Request to join'
            }
        </button>
    )
};  

export default GroupRequestLeaveButton;