import {Link} from 'react-router-dom';
import PostCommentBox from '../PostCommentBox';
import ProfileDisplay from '../../Profiles/ProfileInformation/ProfileDisplay';

const PostCard = ({post}) => {
    return (
        <div>
            {post.shared_by && 
                <span> 
                    {`${post.shared_by.first_name} ${post.shared_by.last_name}`} shared 
                        {`${post.original_poster ? post.original_poster.first_name : post.original_group.title} 
                        ${post.orignial_poster && post.original_poster.last_name}'s`} post 
                </span>
            }

            <div className='flex flex-col items-start border border-slate-200 shadow-sm-slate-200 w-11/12 md:w-full'>
                <div className='flex flex-col items-start bg-white w-full'>
                    <ProfileDisplay logged={post.original_poster ? post.orignal_poster : post.original_group} 
                        is_logged={false} profile_mode={'post'}
                    />
                
                    <Link to={`/api/post/${post.id}/comments`} className='m-2 max-w-3/4' 
                        dangerouslySetInnerHTML={{__html: post.text}}>
                    </Link>
                </div>
                
                <PostCommentBox post={post} />
            </div>
        </div>
    )
}

export default PostCard;