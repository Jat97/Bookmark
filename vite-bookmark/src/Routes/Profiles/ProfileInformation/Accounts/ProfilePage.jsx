import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import {ChatBubbleLeftIcon} from '@heroicons/react/24/solid';
import {useCreateChatMutation} from '../../../Functions/Mutations/ChatMutations';
import {useFetchLogged, useFetchUsers} from '../../../Functions/Queries/UserQueries';
import {useFetchGroups} from '../../../Functions/Queries/GroupQueries';
import {useFetchPosts} from '../../../Functions/Queries/PostQueries';
import {useFetchChats} from '../../../Functions/Queries/ChatQueries';
import {useBookStore} from '../../../../Context/bookStore';
import ProfileDisplay from './ProfileDisplay';
import PostCard from '../../../Feed/Posts/PostCard';
import FriendButton from '../../../Buttons/Profile/User/FriendButton';
import BlockButton from '../../../Buttons/Profile/User/BlockButton';
import GroupRequestLeaveButton from '../../../Buttons/Profile/Group/GroupRequestLeaveButton';
import ProfileInformation from './ProfileInformation';
import ProfileBox from './ProfileBox';
import NoItems from '../../../Miscellaneous/Text/NoItems';
import TextBox from '../../../Miscellaneous/Inputs/TextBox';
import ProfilePageLoad from '../../../Miscellaneous/Loading/Profiles/ProfileInformation/ProfilePageLoad';

const ProfilePage = () => {
    const {profileid} = useParams();

    const location = useLocation();
    const navigate = useNavigate();

    const is_guest = useBookStore((state) => state.is_guest);
    const authorized = useBookStore((state) => state.authorized);
    const setSelectedChat = useBookStore((state) => state.setSelectedChat);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const loggedData = !is_guest && useFetchLogged([authorized, setAuthorized, setSiteError]);
    const userData = useFetchUsers([authorized, setAuthorized, setSiteError]);
    const postData = useFetchPosts([authorized, setAuthorized, setSiteError]);
    const groupData = useFetchGroups([authorized, setAuthorized, setSiteError]);
    const chatData = !is_guest && useFetchChats([authorized, setAuthorized, setSiteError]);

    const current_profile = location.pathname.includes('user') ? 
        userData.data?.users.find(user => user.id.toString() === profileid) :
        location.pathname.includes('group') && groupData.data?.groups?.find(group => group.id.toString() === profileid);
     
    const profile_groups = profileid !== loggedData.data?.profile.id.toString() &&
        groupData.data?.groups?.filter(group => group?.members.some((member) => member.id === current_profile.id));

    const user_posts = postData.data?.posts.filter(post => !current_profile ? 
        (!post.shared_by && loggedData.data.profile.id === post.original_poster?.id) :
        current_profile.first_name ? (!post.shared_by && current_profile.id === post.original_poster?.id) :
        (!post.shared_by && current_profile?.id === post.original_group?.id)  
    );

    const shared_posts = postData.data?.posts.filter(post => 
        !current_profile ? loggedData.data.profile?.id === post.shared_by?.id :
        current_profile?.id === post.shared_by?.id
    );

    const profile_posts = user_posts?.concat(shared_posts);
    
    const create_chat_mutation = useCreateChatMutation([current_profile, setSelectedChat, setSiteError]);

    const startProfileChat = () => {
        if(!chatData.data.chats.some((chat) => chat.chat.user.id === current_profile.id)) {
            create_chat_mutation.mutate();
        }
        else {
            const found_chat = chatData.data.chats.find((chat) => chat.chat.user.id === current_profile.id);

            setSelectedChat(found_chat);
        }

        navigate(`/api/chat/${current_profile.id}`, {rewrite: true});
    };
 
    if(loggedData.isPending || userData.isPending) {
        return <ProfilePageLoad />
    }
    else {
        return (
            <div className={`flex flex-col items-center gap-x-5 h-full md:flex-row border border-red-400
                ${current_profile?.private ? 'md:justify-start gap-x-40' : 'md:justify-evenly'}`}>
                <div className='flex flex-col items-center gap-3 border-b-2 border-slate-200 border-solid 
                    p-2 w-full md:items-start md:border-r-2 md:h-screen md:w-[200px]'>
                    <div className='flex flex-col items-center gap-x-10 md:gap-y-5'>
                        <ProfileDisplay profile={!current_profile ? loggedData.data?.profile : current_profile} 
                            is_logged={!current_profile && true} is_guest={is_guest} profile_mode={'profile'} />

                        {((current_profile?.title && current_profile?.moderator.id !== loggedData.data.profile.id) 
                            && !is_guest) &&
                            <GroupRequestLeaveButton logged={loggedData.data?.profile} group={current_profile} />
                        }

                        {((loggedData.data.profile.id.toString() !== profileid && 
                            current_profile?.moderator?.id !== loggedData.data.profile?.id) && !is_guest) &&
                            <div className='flex flex-row justify-around gap-4 md:flex-col md:items-center '>
                                <FriendButton logged={loggedData.data} user={current_profile} />

                                <BlockButton logged={loggedData.data} user={current_profile} />
                                
                                <button type='button' className='cursor-pointer flex justify-around items-center 
                                    font-semibold bg-zinc-300 rounded-full p-1 w-[150px] hover:bg-slate-100' 
                                    onClick={() => startProfileChat()}>
                                    <ChatBubbleLeftIcon className='h-5 md:h-6' />
                                    Chat
                                </button>
                            </div>
                        }

                        {((!current_profile || 
                            current_profile?.moderator?.id === loggedData.data?.profile?.id) && !is_guest) &&
                            <Link to={`/api/${current_profile?.title ? `group/${current_profile.id}` : 'profile'}/edit`}
                                className='cursor-pointer font-semibold text-blue-600 z-20 hover:underline'> 
                                Edit {current_profile?.title ? 'group' : 'profile'} 
                            </Link>
                        }   
                    </div>

                    <ProfileInformation profile={!current_profile ? loggedData.data?.profile : current_profile} />
                </div>

                {current_profile?.private && (current_profile.moderator.id !== loggedData.data.profile.id 
                    || current_profile.members?.some((member) => member.id === loggedData.data.profile.id 
                    || current_profile.friends?.some((friend) => friend.id === loggedData.data.profile.id))) ?
                    <p className='font-semibold text-lg'> 
                        This profile has been set to private. 
                        Send a request, and they might let you view their posts! 
                    </p>
                :
                    <div className='flex flex-col md:items-start md:w-full'>
                        <div className='flex flex-col items-center gap-y-10 w-screen md:items-start md:w-3/4'>
                            {((!current_profile || (current_profile?.moderator?.id === loggedData.data.profile?.id)) 
                                && !is_guest) &&
                                <div className='w-2/3'>
                                    <TextBox 
                                        post={null} 
                                        poster={
                                            current_profile?.moderator.id === loggedData.data.profile.id ? 
                                            current_profile : loggedData.data.profile
                                        }
                                        for_comment={false}
                                        cancelFn={null}
                                    /> 
                                </div>
                            }
                            
                            <ul className='flex flex-col self-start gap-y-4 md:w-3/4'>
                                {profile_posts?.length > 0 ?
                                    profile_posts?.map(post => {
                                        return (
                                            <div className='flex flex-col'>
                                                <PostCard 
                                                    logged={
                                                        current_profile?.moderator?.id === loggedData.data.profile?.id ? 
                                                        current_profile?.id : loggedData.data.profile?.id
                                                    } 
                                                    post={post} 
                                                />
                                            </div>
                                        )
                                    })
                                :
                                    <NoItems text={'No posts have been made from this account.'} />
                                }
                            </ul>
                        </div>
                        
                        <div className='hidden md:fixed md:top-[150px] md:right-[5px] md:flex md:flex-col md:items-end md:gap-y-5'>
                            <ProfileBox 
                                title={`${current_profile?.title ? 'Members' : 'Friends'}`} 
                                profile={current_profile?.moderator?.id === loggedData.data.profile?.id ? 
                                    current_profile : loggedData.data.profile?.id
                                }
                                items={
                                    loggedData.data?.profile.id !== current_profile?.id ? loggedData.data.friends : 
                                    !current_profile?.title ? current_profile?.friends : 
                                    current_profile?.members
                                }
                            />

                            {!current_profile?.title &&
                                <ProfileBox 
                                    title='Groups'
                                    profile={current_profile?.moderator?.id === loggedData.data.profile?.id ? 
                                        current_profile : loggedData.data.profile?.id
                                    }
                                    items={!profile_groups ? 
                                        groupData.data?.groups.filter(group => 
                                            group.members.some((member) => member.id === loggedData.data?.profile.id)) :
                                        profile_groups
                                    }
                                />
                            }

                            {(profileid === current_profile?.id?.toString() 
                                && current_profile?.moderator?.id === loggedData.data?.profile.id) &&
                                <ProfileBox 
                                    title='Requests'
                                    profile={current_profile?.moderator.id === loggedData.data.profile.id ? 
                                        current_profile : loggedData.data.profile.id
                                    }
                                    items={current_profile?.requests} 
                                />
                            }
                        </div>
                    </div>  
                }                           
            </div>
        ) 
    }   
}

export default ProfilePage;