import {useBanUserMutation, useUnbanUserMutation} from "../../../Functions/Mutations/GroupMutations";
import {useBookStore} from '../../../../Context/bookStore';

const GroupBanUnbanButton = ({group, member}) => {
    const setSiteError = useBookStore((state) => state.setSiteError);

    const banMutation = useBanUserMutation(setSiteError);
    const unbanMutation = useUnbanUserMutation(setSiteError);

    const handleBans = () => {
        if(group.banned_users.some((user) => user.id === member.id)) {
            unbanMutation.mutate({group: group, user: member});
        }
        else {
            banMutation.mutate({group: group, user: member});
        }
    }

    return (
        <button data-testid='ban_unban_user_button' type='button' className={`cursor-pointer font-semibold
            rounded-full w-[100px]
            ${group.banned_users?.some((user) => user.id === member.id) ? 
                    'bg-red-200 hover:bg-pink-100'
                :     
                    'bg-emerald-200 hover:bg-lime-100'}
            `} onClick={() => handleBans()}>
            
            <span>
               {group.banned_users?.some((user) => user.id === member.id) ? 
                    'Unban'
                :
                    'Ban'
                } 
            </span>
        </button>
    )
}

export default GroupBanUnbanButton;