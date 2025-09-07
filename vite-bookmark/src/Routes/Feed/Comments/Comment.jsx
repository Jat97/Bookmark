import UserDisplay from '../../Users/UserDisplay';
import GroupDisplay from '../../Groups/GroupDisplay';
import PostCommentBox from '../Posts/PostCommentBox';

const Comment = (props) => {
    const comment = props.props;

    return (
        <div>
            <div>
                {comment.commenting_user ?
                    <UserDisplay props={[comment.commenting_user, '']} />
                :
                    <GroupDisplay props={[comment.commenting_group, '']} />
                }
            </div>
            
            <div>
                {comment.text}
            </div>

            <div>
                <PostCommentBox props={comment} />
            </div>
        </div>
    )
}

export default Comment;