import {useAcceptRequestMutation, useRejectRequestMutation} from "../Functions/Mutations/FriendMutations";
import {bookStore} from '../../Context/bookStore';

const FriendRequestButtons = (props) => {
    const user = props.props;

    const setSiteError = bookStore((state) => state.setSiteError);

    const accept_friend_mutation = useAcceptRequestMutation([user, setSiteError]);
    const reject_friend_mutation = useRejectRequestMutation([user, setSiteError]);

    const handleFriendRequest = (e) => {
        if(e.target.id === 'accept') {
            return accept_friend_mutation.mutate();
        }
        else {
            return reject_friend_mutation.mutate();
        }
    }

    return (
        <div>
            <button type='button' id='accept' onClick={(e) => handleFriendRequest(e)}>
                Accept
            </button>

            <button type='button' id='reject' onClick={(e) => handleFriendRequest(e)}>
                Reject
            </button>
        </div>
    )
}

export default FriendRequestButtons;