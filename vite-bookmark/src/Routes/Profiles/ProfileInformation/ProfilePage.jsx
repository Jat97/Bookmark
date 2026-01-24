import {useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {ChatBubbleLeftIcon} from '@heroicons/react/24/solid';
import {useFetchLogged, useFetchUsers} from '../../Functions/Queries/UserQueries';
import {useFetchGroups} from '../../Functions/Queries/GroupQueries';
import {useFetchPosts} from '../../Functions/Queries/PostQueries';
import {useBookStore} from '../../../Context/bookStore';
import ProfileDisplay from './ProfileDisplay';
import PostCard from '../../Feed/Posts/PostCard';
import FriendButton from '../../Buttons/Profile/User/FriendButton';
import BlockButton from '../../Buttons/Profile/User/BlockButton';
import GroupRequestLeaveButton from '../../Buttons/Profile/Group/GroupRequestLeaveButton';
import ProfileInformation from './ProfileInformation';
import Index from './ProfileInformation';

const ProfilePage = () => {
    const {profileid} = useParams();

    const [pageMode, setPageMode] = useState('posts');

    const authorized = useBookStore((state) => state.authorized);
    const setSelectedChat = useBookStore((state) => state.setSelectedChat);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const loggedData = useFetchLogged([authorized, setAuthorized, setSiteError]);
    const userData = useFetchUsers([authorized, setAuthorized, setSiteError]);
    const postData = useFetchPosts([authorized, setAuthorized, setSiteError]);
    const groupData = useFetchGroups([authorized, setAuthorized, setSiteError]);

    const user_groups = userData.data?.users.concat(groupData.data?.groups);

    const current_profile = profileid === loggedData.data?.logged_user?.profile.id.toString() ? 
        loggedData.data?.logged_user?.profile : user_groups?.find((page) => page?.id.toString() === profileid)

    const profile_posts = postData.data?.posts.filter(post => current_profile?.first_name ?
       post.original_poster?.id === current_profile?.id : post.original_group?.id === current_profile?.id 
    );

    const startProfileChat = () => {
        setSelectedChat(current_profile);
    };

    const togglePageView = (e) => {
        setPageMode(e.target.id);
    };

    console.log(profile_posts);

    return (
        <div className='relative flex justify-evenly items-center'>
            <div className='absolute top-0 left-0 flex flex-col items-center gap-3 p-2 h-screen md:w-[200px]'>
                <ProfileDisplay profile={!current_profile ? loggedData.data?.logged_user?.profile : current_profile} 
                    is_logged={!current_profile && true} profile_mode={'profile'} />

                <div>
                    {current_profile?.title ?
                        <GroupRequestLeaveButton logged={loggedData.data?.logged_user.profile} group={current_profile}
                            is_member={current_profile.members.some((member) => member.id === loggedData.data.logged_user?.profile.id)}
                            />
                    :
                        current_profile?.id !== loggedData.data?.logged_user?.profile?.id &&
                            <div className='flex flex-col items-center gap-1'>
                                <FriendButton user={current_profile} />

                                <BlockButton user={current_profile} />
                                
                                <button type='button' className='cursor-pointer flex justify-around items-center 
                                    font-semibold bg-zinc-300 rounded-full p-1 w-[125px] hover:bg-slate-100' 
                                    onClick={() => startProfileChat()}>
                                    <ChatBubbleLeftIcon className='h-5 md:h-6' />
                                    Chat
                                </button>
                            </div>
                    }

                    {(loggedData.data?.logged_user.profile?.id === current_profile?.id || 
                        current_profile?.moderator?.id === loggedData.data?.logged_user.profile?.id) &&
                        <Link to={`/api/${current_profile?.title ? 'group' : 'profile'}/edit`}
                            className='cursor-pointer font-semibold text-blue-600 z-20 hover:underline'> 
                            Edit {current_profile?.title ? 'group' : 'profile'} 
                        </Link>
                    }   
                </div>
            </div>

            <div className='absolute top-0 flex flex-col items-center m-5'>
                <div className='font-semibold flex justify-around items-center gap-3' 
                    onClick={(e) => togglePageView(e)}>
                    <p id='posts' className={`cursor-pointer text-center border border-amber-300/50 rounded-tr-md 
                        rounded-tl-md shadow-md shadow-yellow-300 p-1 w-[75px] hover:underline 
                        ${pageMode === 'posts' && 'bg-amber-300/50'}`}> 
                        Posts 
                    </p>

                    <p id={current_profile?.title ? 'about_group' : 'about_user'} 
                        className={`cursor-pointer text-center border border-amber-300/50 rounded-tr-md rounded-tl-md 
                        shadow-sm shadow-yellow-300 p-1 w-[75px] hover:underline 
                        ${(pageMode === 'about_group' || pageMode === 'about_user') && 'bg-amber-300/50'}`}> 
                        About 
                    </p>

                    <p id={`${current_profile?.moderator?.id === loggedData.data?.logged_user?.profile?.id ? 
                        'requests' : 'friends'}`} className={`cursor-pointer text-center border border-amber-300/50 
                        rounded-tr-md rounded-tl-md shadow-md shadow-yellow-300 p-1 w-[75px] hover:underline 
                        ${(pageMode === 'requests' || pageMode === 'friends') && 'bg-amber-300/50'}`}>  
                        {current_profile?.moderator?.id === loggedData.data?.logged_user?.profile?.id ? 
                            'Requests' : 'Friends'
                        }
                    </p>

                    <p id={`${current_profile?.title ? 'members' : 'groups'}`} 
                        className={`cursor-pointer text-center border border-amber-300/50 rounded-tr-md 
                        rounded-tl-md shadow-md shadow-yellow-300 p-1 w-[75px] hover:underline 
                        ${(pageMode === 'members' || pageMode === 'groups') && 'bg-amber-300/50'}`}> 
                        {current_profile?.title ? 'Members' : 'Groups'} 
                    </p>
                </div>

                {pageMode === 'posts' &&
                    <div className='flex flex-col items-start'>
                        {profile_posts?.map(post => {
                            return <PostCard post={post} />
                        })}
                    </div>
                }

                {(pageMode === 'about_group' || pageMode === 'about_user') &&
                    <ProfileInformation 
                        profile={current_profile} 
                        post_count={profile_posts?.length} 
                        user_count={current_profile?.members ? current_profile?.members?.length : 
                            current_profile?.friends?.length
                        }
                    />
                }

                {(pageMode === 'groups' || pageMode === 'friends' || pageMode === 'members') &&
                    <Index logged={pageMode === 'groups' && loggedData.data.logged_user?.profile} 
                        moderator={pageMode === 'groups' && groupData.data?.groups
                            .filter(group => group.members.some((member) => member.id === current_profile.id))}
                        items={pageMode === 'friends' ? current_profile?.friends : 
                        pageMode === 'members' && current_profile?.members }
                    /> 
                }   
            </div>            
        </div>
    )
}

export default ProfilePage;