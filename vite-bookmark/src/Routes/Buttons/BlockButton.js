import {useFetchBlocked} from '../Functions/Queries/UserQueries';
import {useBlockUserMutation, useUnblockUserMutation} from '../Functions/Mutations/BlockMutations';
import {bookStore} from '../../Context/bookStore';
import { useSendFriendRequestMutation } from '../Functions/Mutations/AlertMutations';

const BlockButton = (props) => {
    const user = props.props;

    const authorized = bookStore((state) => state.authorized);
    const setAuthorized = bookStore((state) => state.setAuthorized);
    const setSiteError = bookStore((state) => state.setSiteError);

    const blockData = useFetchBlocked([authorized, setAuthorized, setSiteError]);
    
    const block_mutation = useBlockUserMutation([user, setSiteError]);
    const unblock_mutation = useUnblockUserMutation([user, setSiteError]);

    const blockUser = () => {
        block_mutation.mutate();
    }

    const unblockUser = () => {
        unblock_mutation.mutate();
    }

    return (   
        <button onClick={() => {
            blockData.data.blocked_users.some((blocked) => blocked.id === user.id) ?
                unblockUser()
            :
                blockUser()
        }}>
            {blockData.data.blocked_users.some((blocked) => blocked.id === user.id ?
                'Unblock'
            :
                'Block'
            )}
        </button>
    )
};

export default BlockButton;