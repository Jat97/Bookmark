import {TrashIcon} from '@heroicons/react/24/solid';
import {useDeleteCommentMutation} from '../../Functions/Mutations/PostMutations';
import {useBookStore} from '../../../Context/bookStore';
import ProfileDisplay from '../../Profiles/ProfileInformation/Accounts/ProfileDisplay';
import PostCommentBox from '../PostCommentBox';

const Comment = ({comment, is_logged}) => {
    const setSiteError = useBookStore((state) => state.setSiteError);

    const delete_comment_mutation = useDeleteCommentMutation([comment?.id, setSiteError]);

    const deleteComment = () => {
        return delete_comment_mutation.mutate();
    }

    return (
        <div className='relative flex flex-col items-start'>
            {is_logged &&
                <TrashIcon className='absolute top-[5px] right-[10px] cursor-pointer h-4 stroke-zinc-300 
                    md:h-5 hover:stroke-slate-100' 
                    onClick={() => deleteComment()} />
            }
            
            <ProfileDisplay profile={comment?.commenting_user ? comment?.commenting_user : comment?.commenting_group} 
                is_logged={false} profile_mode={'post'}
            />
            
            <span className='m-1 p-1 break-normal w-3/4' dangerouslySetInnerHTML={{__html: comment?.text}}></span>

            <PostCommentBox post={comment} />
        </div>
    )
}

export default Comment;