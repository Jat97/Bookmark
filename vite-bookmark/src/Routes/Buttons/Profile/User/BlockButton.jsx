import {useFetchBlocked} from '../../../Functions/Queries/UserQueries';
import {useBlockUserMutation, useUnblockUserMutation} from '../../../Functions/Mutations/BlockMutations';
import {useBookStore} from '../../../../Context/bookStore';

const BlockButton = ({user}) => {
    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

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
        <button id={user?.id} data-testid={user?.id} className={`cursor-pointer font-semibold rounded-full w-[125px] 
            ${blockData.data?.blocked?.some((blocked) => blocked?.id === user?.id) ? 
            'bg-zinc-200 hover:bg-grey-100' : 'bg-violet-200 hover:bg-pink-100'}`}
            onClick={() => handleBlockMutations()}>
            {blockData.data?.blocked?.some((blocked) => blocked?.id === user?.id ?
                'Unblock'
            :
                'Block'
            )}
        </button>
    )
};

export default BlockButton;