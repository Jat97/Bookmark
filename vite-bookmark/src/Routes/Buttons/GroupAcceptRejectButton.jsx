import {useGroupAcceptMutation, useGroupRejectMutation} from '../Functions/Mutations';
import {bookStore} from '../../Context/bookStore';

const GroupAcceptRejectMutation = (props) => {
    const group = props.props[0];
    const request = props.props[1];

    const setSiteError = bookStore((state) => state.setSiteError);

    const group_accept_mutation = useGroupAcceptMutation([group, request, setSiteError]);
    const group_reject_mutation = useGroupRejectMutation([group, request, setSiteError]);

    const handleGroupRequest = (e) => {
        if(e.target.id === 'accept') {
            return group_accept_mutation.mutate();
        }
        else {
            return group_reject_mutation.mutate();
        }
       
    }

    return (
        <div>
            <button type='button' id='accept' onClick={(e) => handleGroupRequest(e)}>
                Accept request
            </button>

            <button type='button' id='reject' onClick={(e) => handleGroupRequest(e)}>
                Reject request
            </button>
        </div>
    )
}

export default GroupAcceptRejectMutation;