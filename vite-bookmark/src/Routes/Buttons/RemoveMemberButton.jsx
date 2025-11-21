import {useTerminateMembershipMutation} from "../Functions/Mutations/GroupMutations";
import {useBookStore} from '../../Context/bookStore';

const RemoveMemberButton = (props) => {
    const group = props.props[0];
    const member = props.props[1];

    const setSiteError = useBookStore((state) => state.setSiteError);

    const terminateMutation = useTerminateMembershipMutation([group.id, member.id, setSiteError]);

    const removeMember = () => {
        terminateMutation.mutate();
    }

    return (
        <button data-testid='terminate_membership_button' type='button' className='bg-red-300' 
            onClick={() => removeMember()}>
            Remove from group
        </button>
    )
}

export default RemoveMemberButton;