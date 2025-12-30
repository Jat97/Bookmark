import {useParams} from 'react-router-dom';
import {ChatBubbleLeftIcon} from '@heroicons/react/24/solid';
import {useFetchLogged, useFetchUsers} from '../Functions/Queries/UserQueries';
import {useFetchPosts} from '../Functions/Queries/PostQueries';
import {useBookStore} from '../../Context/bookStore';
import UserDisplay from './UserDisplay';
import PostCard from '../Feed/Posts/PostCard';
import FriendButton from '../Buttons/FriendButton';
import BlockButton from '../Buttons/BlockButton';
import Navbar from './Navbar';

const UserPage = () => {
    const {userid} = useParams();

    const authorized = useBookStore((state) => state.authorized);
    const setSelectedChat = useBookStore((state) => state.setSelectedChat);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const loggedData = useFetchLogged([authorized, setAuthorized, setSiteError]);
    const userData = useFetchUsers([authorized, setAuthorized, setSiteError]);
    const postData = useFetchPosts([authorized, setAuthorized, setSiteError]);

    const current_user = userData.data?.users.find((user) => user.id.toString() === userid);
    const user_posts = postData.data?.posts.filter(post => post.original_poster?.id === current_user?.id);

    const startProfileChat = () => {
        setSelectedChat(current_user);
    }

    return (
        <div>
            <Navbar />

            <div className='grid grid-cols-2 items-center'>
                <div className='flex flex-col items-center gap-2 bg-orange-300 p-2 h-screen w-1/3'>
                    <UserDisplay props={
                        [!current_user ? loggedData.data?.logged_user : current_user, 
                        !current_user && true, 
                        'profile'
                        ]
                    } />

                    <div>
                        {current_user &&
                            <div className='flex flex-col items-center gap-1'>
                                <FriendButton props={current_user} />

                                <BlockButton props={current_user} />
                                
                                <button type='button' className='cursor-pointer flex justify-around items-center 
                                    font-semibold bg-zinc-300 rounded-full p-1 w-[125px] hover:bg-slate-100' 
                                    onClick={() => startProfileChat()}>
                                    <ChatBubbleLeftIcon className='h-5 md:h-6' />
                                    Chat
                                </button>
                            </div>
                        }
                    </div>
                </div>

                <div className='flex flex-col items-center md:w-2/3'>
                    {user_posts?.map(post => {
                        return <PostCard props={post} />
                    })}
                </div>               
            </div>
        </div>
    )
};

export default UserPage;