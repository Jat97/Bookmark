import {Link, useParams} from 'react-router-dom';
import {useFetchUsers} from '../Functions/Queries/UserQueries';
import {useFetchGroups} from '../Functions/Queries/GroupQueries';
import {useBookStore} from '../../Context/bookStore';
import UserDisplay from './UserDisplay';
import FriendButton from '../Buttons/FriendButton';
import BlockButton from '../Buttons/BlockButton';
import PageHeader from '../Miscellaneous/Text/PageHeader';
import Navbar from './Navbar';

const Index = () => {
    const {groupid} = useParams();

    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const groupData = groupid ? useFetchGroups([authorized, setAuthorized, setSiteError]) : null;
    const userData = groupid ? null : useFetchUsers([authorized, setAuthorized, setSiteError]);

    const user_arr = groupData ? groupData.data.groups.members : userData.data?.users;

    return (
        <div>
            <Navbar />
            
            <PageHeader props={groupData ? 'Members' : 'Users'} />

            <ul className='flex flex-col items-center'>
                {user_arr?.map(user => {
                    return (
                        <li className='flex justify-around items-center w-2/3'>
                            <UserDisplay props={[user, false, 'index']} />

                            <div className='flex flex-col items-center'>
                                <FriendButton props={user} />

                                <BlockButton props={user} />
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
};

export default Index;