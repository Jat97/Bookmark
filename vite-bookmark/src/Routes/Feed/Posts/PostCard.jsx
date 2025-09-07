import UserDisplay from '../../Users/UserDisplay';
import GroupDisplay from '../../Groups/GroupDisplay';
import PostCommentBox from '../PostCommentBox';

const PostCard = (props) => {
    const post = props.props;

    return (
        <div>
            {post.original_poster ? 
                <UserDisplay props={[post.original_poster, '']} /> 
            :
                <GroupDisplay props={[post.original_group, '']} />
            }
           
            <p> {post.text} </p>

            <PostCommentBox props={post} />
        </div>
    )
}

export default PostCard;