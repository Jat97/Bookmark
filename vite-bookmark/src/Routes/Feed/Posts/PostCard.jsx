import UserDisplay from '../../Users/UserDisplay';
import GroupDisplay from '../../Groups/GroupDisplay';
import PostCommentBox from '../PostCommentBox';

const PostCard = (props) => {
    const post = props.props;

    return (
        <div className='flex flex-col items-start'>
            {post.original_poster ? 
                <UserDisplay props={[post.original_poster, '']} /> 
            :
                <GroupDisplay props={[post.original_group, '']} />
            }
           
            <p className='max-w-3/4'> {post.text} </p>

            <PostCommentBox props={post} />
        </div>
    )
}

export default PostCard;