import {ArrowUTurnLeftIcon, ChatBubbleLeftRightIcon, HandThumbUpIcon, HandThumbDownIcon} from "@heroicons/react/24/solid";
import {bookStore} from '../../Context/bookStore';
import {useFetchLogged} from '../Functions/Queries/UserQueries';
import LikeButton from '../Buttons/LikeButton';

const PostCommentBox = (props) => {
    const post = props.props;

    const authorized = bookStore((state) => state.authorized);
    const setAuthorized = bookStore((state) => state.setAuthorized);
    const setSiteError = bookStore((state) => state.setSiteError);

    const loggedData = useFetchLogged([authorized, setAuthorized, setSiteError]);

    return (
        <div>
            {post.likes.length === 0 ?
                null
            :
                <div>
                    {post.likes.slice(0, 3).map(like => {
                        return (
                            <p> {`${like.first_name} ${like.last_name}`} </p>
                        )
                    })}

                    {post.likes.length > 3 &&
                        <p> and others </p>
                    }

                    liked this
                </div>
            }
            
            <div>
                <LikeButton props={[loggedData.data.logged_user, post]} />

                <button>
                    <ArrowUTurnLeftIcon className='h-6' />

                    Share
                </button>

                <button>
                    <ChatBubbleLeftRightIcon className='h-6' />

                    Comment
                </button>
            </div>
        </div>
    )
}

export default PostCommentBox;