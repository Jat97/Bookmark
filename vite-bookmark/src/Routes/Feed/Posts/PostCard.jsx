import UserDisplay from '../../Users/UserDisplay';
import GroupDisplay from '../../Groups/GroupDisplay';
import PostCommentBox from '../PostCommentBox';

const PostCard = (props) => {
    const post = props.props;

    return (
        <div className='flex flex-col items-start border border-slate-200 shadow-sm-slate-200 w-11/12 md:w-full'>
            <div className='flex flex-col items-start bg-white w-full'>
                {post.original_poster ? 
                    <UserDisplay props={[post.original_poster, false, 'post']} /> 
                :
                    <GroupDisplay props={[post.original_group, false, 'post']} />
                }
            
                <p className='m-2 max-w-3/4' dangerouslySetInnerHTML={{__html: post.text}}></p>
            </div>
            
            <PostCommentBox props={post} />
        </div>
    )
}

export default PostCard;