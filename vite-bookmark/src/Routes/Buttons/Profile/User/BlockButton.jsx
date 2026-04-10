import {useBlockUserMutation, useUnblockUserMutation} from '../../../Functions/Mutations/BlockMutations';
import {useBookStore} from '../../../../Context/bookStore';

const BlockButton = ({logged, user}) => {
    const setSiteError = useBookStore((state) => state.setSiteError);
    
    const block_mutation = useBlockUserMutation(setSiteError);
    const unblock_mutation = useUnblockUserMutation(setSiteError);

    const handleBlockMutations = () => {
        if(logged.blocked.some((blocked) => blocked.id === user.id)) {
            return block_mutation.mutate({user: user});
        }
        else {
            return unblock_mutation.mutate({user: user});
        }
    }

    return (   
        <button id={user?.id} data-testid={user?.id} className={`cursor-pointer font-semibold rounded-full w-[150px] 
            ${logged?.blocked?.some((blocked) => blocked?.id === user?.id) ? 
            'bg-zinc-200 hover:bg-grey-100' : 'bg-violet-200 hover:bg-pink-100'}`}
            onClick={() => handleBlockMutations()}>
            {logged?.blocked?.some((blocked) => blocked?.id === user?.id ?
                'Unblock'
            :
                'Block'
            )}
        </button>
    )
};

export default BlockButton;