import {useParams, useLocation} from 'react-router-dom';
import {ChatBubbleLeftIcon} from '@heroicons/react/24/solid';
import {useFetchLogged, useFetchUsers} from '../Functions/Queries/UserQueries';
import {useFetchPosts} from '../Functions/Queries/PostQueries';
import {useBookStore} from '../../Context/bookStore';
import ProfileDisplay from '../Miscellaneous/Images/ProfileDisplay';
import PostCard from '../Feed/Posts/PostCard';
import FriendButton from '../Buttons/FriendButton';
import BlockButton from '../Buttons/BlockButton';
import GroupRequestLeaveButton from '../Buttons/GroupRequestLeaveButton';
import Navbar from '../Users/Navbar';

const ProfilePage = () => {
    const {profileid} = useParams();
    const location = useLocation();

    const authorized = useBookStore((state) => state.authorized);
    const setSelectedChat = useBookStore((state) => state.setSelectedChat);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const loggedData = useFetchLogged([authorized, setAuthorized, setSiteError]);
    const userData = useFetchUsers([authorized, setAuthorized, setSiteError]);
    const postData = useFetchPosts([authorized, setAuthorized, setSiteError]);
    const groupData = useFetchGroups([authorized, setAuthorized, setSiteError]);

    const current_profile = location.pathname.includes('group') ? 
        groupData.data.groups.find((group) => group.id.toString() === profileid) 
    : 
        userData.data.users.find((user) => user.id.toString() === profileid);

    const profile_posts = postData.data?.posts.filter(post => location.pathname.includes('group') ? 
        post.original_group?.id === current_profile?.id : post.original_user.id === current_profile.id);

    const startProfileChat = () => {
        setSelectedChat(current_user);
    }

    return (
        <div>
            <Navbar />

            <div className='grid grid-cols-2 items-center'>
                <div className='flex flex-col items-center gap-2 bg-orange-300 p-2 h-screen w-1/3'>
                    <ProfileDisplay props={
                        [!current_user ? loggedData.data?.logged_user : current_user, 
                        !current_user && true, 
                        'profile'
                        ]
                    } />

                    <div>
                        {location.pathname.includes('group') ?
                            <GroupRequestLeaveButton props={[
                                loggedData.data.logged_user, 
                                current_profile,
                                current_profile.members.some((member) => member.id === loggedData.data.logged_user.id)
                            ]} />
                        :
                            current_profile.id === loggedData.data.logged_user.id &&
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
                        
                        <p className='cursor-pointer hover:underline'> Posts </p>

                        {location.pathname.includes('group') ? 
                            <div>
                                {current_profile.moderator.id === loggedData.data.logged_user.id &&
                                    <p> Edit group </p>
                                }
                                
                                <p> About </p>
                                <p> Members </p>  
                                <p> Requests </p>
                            </div>
                        :
                            <div className='font-semibold'>
                                {current_profile.id !== loggedData.data.logged_user.id && 
                                    <p className='cursor-pointer hover:underline'> Edit profile </p>
                                }
                                
                                <p className='cursor-pointer hover:underline'> Friends </p>
                                <p className='cursor-pointer hover:underline'> Groups </p>
                            </div> 
                        }                        
                    </div>
                </div>

                <div className='flex flex-col items-center md:w-2/3'>
                    {profile_posts?.map(post => {
                        return <PostCard props={post} />
                    })}
                </div>               
            </div>
        </div>
    )
}

export default ProfilePage;