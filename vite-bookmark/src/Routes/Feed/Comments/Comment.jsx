import ProfileDisplay from '../../Profiles/ProfileInformation/ProfileDisplay';
import PostCommentBox from '../Posts/PostCommentBox';

const Comment = ({comment}) => {
    return (
        <div className='flex flex-col items-start'>
            <div>
                <ProfileDisplay profile={comment.commenting_user ? comment.commenting_user : comment.commenting_group} 
                    is_logged={false} profile_mode={'post'}
                />
            </div>
            
            <div className='max-w-3/4'>
                {comment.text}
            </div>

            <div>
                <PostCommentBox post={comment} />
            </div>
        </div>
    )
}

export default Comment;