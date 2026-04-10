import {Link} from 'react-router-dom';
import {TrashIcon} from '@heroicons/react/24/solid';
import {useDeletePostMutation} from '../../Functions/Mutations/PostMutations';
import {useBookStore} from '../../../Context/bookStore';
import PostCommentBox from '../PostCommentBox';
import ProfileDisplay from '../../Profiles/ProfileInformation/Accounts/ProfileDisplay';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const PostCard = ({logged, post}) => {
    const setSiteError = useBookStore((state) => state.setSiteError);
    const delete_post_mutation = useDeletePostMutation([post?.id, setSiteError]);

    const deletePost = () => {
        return delete_post_mutation.mutate();
    }

    return (
        <div className='relative flex flex-col items-start border border-slate-200 shadow-sm-slate-200 w-full'>
            {post?.shared_by && 
                <div className='flex justify-start items-center gap-x-2 border-b-2 border-slate-200 border-solid w-full'> 
                    <Link to={`/api/profile/${post.shared_by.id}`} className='font-semibold text-blue-600 ml-1 hover:underline'> 
                        {`${post.shared_by.first_name} ${post.shared_by.last_name}`} 
                    </Link>

                    <span>
                        shared {`${post?.original_poster ? post?.original_poster.first_name : post?.original_group.title} 
                        ${post?.original_poster && post?.original_poster.last_name}'s`} post 
                    </span>
                </div>
            }
            
           {(logged === post.original_poster?.id || logged === post.shared_by?.id) && 
                <TrashIcon className='absolute top-[2px] right-[10px] h-4 stroke-zinc-400 md:h-5 hover:stroke-slate-100' 
                    onClick={() => deletePost()} />
            }

            <div className='flex flex-col items-start bg-white w-full'> 
                <div className='flex justify-between items-center w-full'>
                    <ProfileDisplay profile={post?.original_poster ? post?.original_poster : post?.original_group} 
                        is_logged={false} profile_mode={'post'}
                    /> 
                
                    <span className='text-sm text-slate-400 mr-[10px]'> {dayjs().to(post.posted)} </span>
                </div>
            
                <span className='break-all m-2 p-2 w-5/6' dangerouslySetInnerHTML={{__html: post?.text}}></span>
            </div>
            
            <PostCommentBox post={post} />
        </div>
    )
}

export default PostCard;