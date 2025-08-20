import {Link, useParams} from 'react-router-dom';
import {useFetchUsers} from '../Functions/Queries/UserQueries';
import {useFetchGroups} from '../Functions/Queries/GroupQueries';
import {bookStore} from '../../Context/bookStore';
import UserDisplay from './UserDisplay';
import GroupDisplay from '../Groups/GroupDisplay';
import FriendButton from '../Buttons/FriendButton';

const Index = () => {
    const {groupid} = useParams();

    const authorized = bookStore((state) => state.authorized);
    const setAuthorized = bookStore((state) => state.setAuthorized);
    const setSiteError = bookStore((state) => state.setSiteError);

    const groupData = groupid ? useFetchGroups([authorized, setAuthorized, setSiteError]) : null;
    const userData = groupid ? null : useFetchUsers([authorized, setAuthorized, setSiteError]);

    const user_arr = groupData ? groupData.data.groups.members : userData.data.users;

    return (
        <div>
            <p> {groupData ? 'Members': 'Users'} </p>

            <ul>
                {user_arr.map(user => {
                    return (
                        <li>
                            <UserDisplay props={[user, '']} />

                            <FriendButton props={user} />
                        </li>
                    )
                })}
            </ul>
        </div>
    )
};

export default Index;