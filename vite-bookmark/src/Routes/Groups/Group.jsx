import {Link, useParams} from 'react-router-dom';
import {PencilIcon} from '@heroicons/react/24/solid';
import {useFetchLogged} from '../Functions/Queries/UserQueries';
import {useFetchGroups} from '../Functions/Queries/GroupQueries';
import {useFetchPosts} from '../Functions/Queries/PostQueries';
import {useBookStore} from '../../Context/bookStore';
import PostCard from '../Feeds/Posts/PostCard';
import GroupDisplay from './GroupDisplay';
import UserDisplay from '../Users/UserDisplay';
import GroupRequestLeaveButton from '../Buttons/GroupRequestLeaveButton';
import GroupAcceptRejectButton from '../Buttons/GroupAcceptRejectButton';
import NoItems from '../Miscellaneous/Text/NoItems';

const Group = () => {
    const {groupid} = useParams();

    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const loggedData = useFetchLogged([authorized, setAuthorized, setSiteError]);
    const groupData = useFetchGroups([authorized, setAuthorized, setSiteError]); 
    const postData = useFetchPosts([authorized, setAuthorized, setSiteError]);
    
    const current_group = groupData.data.groups.find(group => group.group.id === groupid);
    const group_posts = postData.data.posts.filter(post => post.original_group = current_group.id);

    return (
        <div>
            <div className='flex justify-around items-center border border-slate-200 shadow-sm shadow-slate-200'>
                <GroupDisplay props={[current_group, 'page']} />

                {loggedData.data.logged_user.id === current_group.group.moderator ?
                    <Link to={`/api/group/update/${current_group.id}`}>
                        <PencilIcon className='h-6' />

                        Edit group info
                    </Link>
                :
                    <GroupRequestLeaveButton props={[
                        loggedData.data.logged_user, 
                        current_group, 
                        current_group.members.some((member) => member.id === loggedData.data.logged_user.id)
                    ]} />
                }                 
            </div>

            <div className='grid grid-cols-2'>
                <ul className='w-3/4'>
                    {group_posts.map(post => {
                        return <PostCard props={post} />
                    })}
                </ul>

                <div className='w-1/4'>
                    {loggedData.data.logged_user.id === current_group.group.moderator ?
                        <div className='border border-slate-200 shadow-sm shadow-slate-200'>
                            <span className='text-lg font-semibold'> Requests </span>

                            {current_group.requests.length === 0 ?
                                <NoItems props={'No requests'} />
                            :   
                                <div>
                                    <ul>
                                        {current_group.slice(0, 3).requests.map(request => {
                                            return (
                                                <li className='flex justify-around items-center'>
                                                    <UserDisplay props={[request, '']} />

                                                    <GroupAcceptRejectButton props={[current_group, request]} />
                                                </li>
                                            )
                                        })}
                                    </ul>

                                    {current_group.requests && 
                                        <p className='text-blue-600 hover:underline'> 
                                            View {current_group.requests.length} requests 
                                        </p>
                                    }
                                </div>
                            }
                        </div>
                    :
                        null
                    }
                    
                    <div className='border border-slate-200 shadow-sm shadow-slate-200'>
                        <span className='text-lg font-semibold'> Members </span>

                        <ul>
                            {current_group.members.length === 0 ?
                                <NoItems props={'No members yet'} />
                            :
                                current_group.members.slice(0, 3).map(member => {
                                    return (
                                        <li>
                                            <UserDisplay props={[member, '']} />
                                        </li>
                                    )
                                })
                            }
                        </ul>

                        <Link to={`/api/group/members/${current_group.id}`} className='text-blue-600 hover:underline'>
                            View all members
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Group;