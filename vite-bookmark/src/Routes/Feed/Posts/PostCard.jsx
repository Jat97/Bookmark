import PostCommentBox from '../PostCommentBox';
import ProfileDisplay from '../../Miscellaneous/Images/ProfileDisplay';

const PostCard = (props) => {
    const post = props.props;

    return (
        <div className='flex flex-col items-start border border-slate-200 shadow-sm-slate-200 w-11/12 md:w-full'>
            <div className='flex flex-col items-start bg-white w-full'>
                <ProfileDisplay props={[
                    post.original_poster ? post.original_poster : post.original_group, 
                    false, 
                    'post'
                ]}/>
            
                <p className='m-2 max-w-3/4' dangerouslySetInnerHTML={{__html: post.text}}></p>
            </div>
            
            <PostCommentBox props={post} />
        </div>
    )
}

export default PostCard;