import {Link, useParams} from 'react-router-dom';
import {PencilIcon} from '@heroicons/react/24/solid';
import {useFetchLogged} from '../Functions/Queries/UserQueries';
import {useFetchGroups} from '../Functions/Queries/GroupQueries';
import {useBookStore} from '../../Context/bookStore';
import GroupDisplay from './GroupDisplay';
import UserDisplay from '../Users/UserDisplay';
import GroupRequestLeaveButton from '../Buttons/GroupRequestLeaveButton';
import GroupAcceptRejectButton from '../Buttons/GroupAcceptRejectButton';

const Group = () => {
    const {groupid} = useParams();

    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const loggedData = useFetchLogged([authorized, setAuthorized, setSiteError]);
    const groupData = useFetchGroups([authorized, setAuthorized, setSiteError]);
    const current_group = groupData.data.groups.find(group => group.group.id === groupid);

    return (
        <div>
            <div>
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

            <div>
                {loggedData.data.logged_user.id === current_group.group.moderator ?
                    <div>
                        Requests

                        {current_group.requests.length === 0 ?
                            "No requests"
                        :   
                            <div>
                                <ul>
                                    {current_group.slice(0, 3).requests.map(request => {
                                        return (
                                            <li>
                                                <UserDisplay props={[request, '']} />

                                                <GroupAcceptRejectButton props={[current_group, request]} />
                                            </li>
                                        )
                                    })}
                                </ul>

                                {current_group.requests && 
                                    <p> View {current_group.requests.length} requests </p>
                                }

                            </div>
                        }
                    </div>
                :
                    null
                }
                
                <div>
                    Members 

                    <ul>
                        {current_group.members.length === 0 ?
                            "No members yet"
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

                    <Link to={`/api/group/members/${current_group.id}`}>
                        View all members
                    </Link>
                </div>
            </div>
        </div>
    )
};

export default Group;