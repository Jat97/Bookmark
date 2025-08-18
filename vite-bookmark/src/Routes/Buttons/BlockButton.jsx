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

    const handleBlockMutations = () => {
        if(blockData.data.blocked_users.some((blocked) => blocked.id === user.id)) {
            return block_mutation.mutate();
        }
        else {
            return unblock_mutation.mutate();
        }
    }

    return (   
        <button onClick={() => handleBlockMutations()}>
            {blockData.data.blocked_users.some((blocked) => blocked.id === user.id ?
                'Unblock'
            :
                'Block'
            )}
        </button>
    )
};

export default BlockButton;