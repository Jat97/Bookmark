import {useParams} from 'react-router-dom';
import {useFetchLogged, useFetchUsers} from '../Functions/Queries/UserQueries';
import {useFetchPosts} from '../Functions/Queries/PostQueries';
import {useBookStore} from '../../Context/bookStore';
import UserDisplay from './UserDisplay';
import PostCard from '../Posts/PostCard';
import FriendButton from '../Buttons/FriendButton';
import BlockButton from '../Buttons/BlockButton';

const UserPage = () => {
    const {userid} = useParams();
    const authorized = useBookStore((state) => state.authorized);
    const selected_chat = useBookStore((state) => state.selected_chat);
    const setSelectedChat = useBookStore((state) => state.setSelectedChat);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const loggedData = useFetchLogged([authorized, setAuthorized, setSiteError]);
    const userData = useFetchUsers([authorized, setAuthorized, setSiteError]);

    const current_user = userData.data.users.find(user => user.id === userid);
    const user_posts = postData.data.posts.filter(post => post.original_poster.id === current_user.id);

    const startProfileChat = () => {
        setSelectedChat(current_user);
    }

    return (
        <div>
            <div className='flex justify-around items-center border border-slate-200'>
                <UserDisplay props={[current_user, loggedData.data.logged_user, 'profile']} />

                {current_user.id !== loggedData.data.logged_user.id &&
                    <div className='flex flex-col items-center'>
                        <FriendButton props={current_user} />

                        <BlockButton props={current_user} />
                        
                        <button type='button' className='font-semibold bg-orange-200 hover:bg-amber-100' 
                            onClick={() => startProfileChat()}>
                            Chat
                        </button>
                    </div>
                }
            </div>

            <div>
                {user_posts.map(post => {
                    return <PostCard props={post} />
                })}
            </div>
        </div>
    )
};

export default UserPage;