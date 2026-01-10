import {useBanUserMutation, useUnbanUserMutation} from "../Functions/Mutations/GroupMutations";
import {useBookStore} from '../../Context/bookStore';

const GroupBanUnbanButton = (props) => {
    const group = props.props[0];
    const member = props.props[1];

    const setSiteError = useBookStore((state) => state.setSiteError);

    const banMutation = useBanUserMutation([member, group, setSiteError]);
    const unbanMutation = useUnbanUserMutation([member, group, setSiteError]);

    const handleBans = () => {
        if(group.banned_users.some((user) => user.id === member.id)) {
            banMutation.mutate();
        }
        else {
            unbanMutation.mutate();
        }
    }

    return (
        <button data-testid='ban_unban_user_button' type='button' className={`cursor-pointer p-1 w-[100px]
            ${group.banned_users.some((user) => user.id === member.id ? 
                    'bg-teal-200 hover:bg-sky-100' 
                :     
                    'bg-red-200 hover:bg-pink-100')}
            `} onClick={() => handleBans()}>
            {group.banned_users.some((user) => user.id === member.id) ? 
                'Unban'
            :
                'Ban'
            }
        </button>
    )
}

export default GroupBanUnbanButton;