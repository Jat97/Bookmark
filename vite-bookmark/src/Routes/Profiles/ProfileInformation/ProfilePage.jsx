import {useState} from 'react';
import {useParams, useLocation} from 'react-router-dom';
import {ChatBubbleLeftIcon} from '@heroicons/react/24/solid';
import {useFetchLogged, useFetchUsers} from '../../Functions/Queries/UserQueries';
import {useFetchPosts} from '../../Functions/Queries/PostQueries';
import {useBookStore} from '../../../Context/bookStore';
import ProfileDisplay from './ProfileDisplay';
import PostCard from '../../Feed/Posts/PostCard';
import FriendButton from '../../Buttons/FriendButton';
import BlockButton from '../../Buttons/BlockButton';
import GroupRequestLeaveButton from '../../Buttons/GroupRequestLeaveButton';
import EditGroup from '../Groups/EditGroup';
import EditProfile from '../Users/EditProfile';
import ProfileDescription from './ProfileDescription';

const ProfilePage = () => {
    const {profileid} = useParams();
    const location = useLocation();

    const [pageMode, setPageMode] = useState('posts');

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

    const togglePageView = (e) => {
        setPageMode(e.currentTarget.id);
    }

    return (
        <div>
            <div className='grid grid-cols-2 items-center'>
                <div className='flex flex-col items-center gap-2 bg-orange-300 p-2 h-screen w-1/3'>
                    <ProfileDisplay props={[
                        !current_profile ? loggedData.data?.logged_user : current_profile, 
                        !current_profile && true, 
                        'profile'
                    ]} />

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
                    </div>

                    <div onClick={(e) => togglePageView(e)}>
                        <p id='posts' className='cursor-pointer hover:underline'> Posts </p>

                        {location.pathname.includes('group') ? 
                            <div>
                                {current_profile.moderator.id === loggedData.data.logged_user.id &&
                                    <div>
                                        <p id='edit_group'> Edit group </p>
                                        <p id='requests'> Requests <span> {current_profile.requests.length} </span> </p>
                                    </div>
                                }
                                
                                <p id='about_group'> About </p>
                                <p id='members'> Members </p>  
                            </div>
                        :
                            <div className='font-semibold'>
                                {current_profile.id !== loggedData.data.logged_user.id && 
                                    <p id='edit_profile' className='cursor-pointer hover:underline'> Edit profile </p>
                                }

                                <p id='about_user'> About </p>
                                <p id='friends' className='cursor-pointer hover:underline'> Friends </p>
                                <p id='groups' className='cursor-pointer hover:underline'> Groups </p>
                            </div> 
                        }  
                    </div>
                </div>

                {pageMode === 'posts' ?
                    <div className='flex flex-col items-center md:w-2/3'>
                        {profile_posts?.map(post => {
                            return <PostCard props={post} />
                        })}
                    </div>
                :
                    pageMode === 'edit_group' ?
                        <EditGroup props={groupData.data.groups.find((group) => group.id === profileid)} />
                    :
                        pageMode === 'edit_profile' ?
                            <EditProfile props={current_profile} />
                        :
                            pageMode === 'about_group' || pageMode === 'about_user' ?
                                <ProfileDescription props={current_profile.description} />
                            :
                                <Index props={[
                                    pageMode === 'groups' && loggedData.data.logged_user,
                                    pageMode === 'friends' ? current_profile.friends : 
                                    pageMode === 'requests' ? current_profile.requests :
                                    pageMode === 'members' ? current_profile.members : 
                                    pageMode === 'groups' && 
                                    groupData.data.groups.filter(group => group.members.some((member) => member.id === current_profile.id))
                                ]} />
                }                               
            </div>
        </div>
    )
}

export default ProfilePage;