import {useGroupRequestMutation, useTerminateMembershipMutation} from "../Functions/Mutations/GroupMutations";
import {useBookStore} from '../../Context/bookStore';

const GroupRequestLeaveButton = (props) => {
    const logged = props.props[0];
    const group = props.props[1];
    const is_member = props.props[2];

    const setSiteError = useBookStore((state) => state.setSiteError);

    const group_request_mutation = useGroupRequestMutation([logged, group, setSiteError]);
    const terminate_mutation = useTerminateMembershipMutation([logged, group, setSiteError]);

    const handleGroupMutations = () => {
        if(is_member) {
            return terminate_mutation.mutate();
        }
        else {
            return group_request_mutation.mutate();
        }
    }

    return (
        <button type='button' data-testid={'group_membership_button'} onClick={() => handleGroupMutations()}>
            {is_member ?
                'Leave group'
            :
                'Request to join'
            }
        </button>
    )
};  

export default GroupRequestLeaveButton;