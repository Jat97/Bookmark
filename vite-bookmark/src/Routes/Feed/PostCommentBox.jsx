import {useState} from 'React';
import {ArrowUTurnLeftIcon, ChatBubbleLeftRightIcon, HandThumbUpIcon, HandThumbDownIcon} from "@heroicons/react/24/solid";
import {useBookStore} from '../../Context/bookStore';
import {useFetchLogged} from '../Functions/Queries/UserQueries';
import LikeButton from '../Buttons/LikeButton';
import TextBox from '../Miscellaneous/Inputs/TextBox';

const PostCommentBox = (props) => {
    const post = props.props;

    const [displayTextBox, setDisplayTextBox] = useState(false);

    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const loggedData = useFetchLogged([authorized, setAuthorized, setSiteError]);

    const toggleTextBox = () => {
        setDisplayTextBox(displayTextBox ? false : true);
    }

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

                <button type='button' onClick={() => toggleTextBox()}>
                    <ChatBubbleLeftRightIcon className='h-6' />

                    Comment
                </button>
            </div>

            {displayTextBox && 
                <TextBox props={['', '']} />
            }
        </div>
    )
}

export default PostCommentBox;