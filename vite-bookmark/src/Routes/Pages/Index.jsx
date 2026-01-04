import {useLocation} from 'react-router-dom';
import {useFetchLogged, useFetchUsers} from '../Functions/Queries/UserQueries';
import {useFetchGroups} from '../Functions/Queries/GroupQueries';
import {useBookStore} from '../../Context/bookStore';
import FriendButton from '../Buttons/FriendButton';
import BlockButton from '../Buttons/BlockButton';
import GroupRequestLeaveButton from '../Buttons/GroupRequestLeaveButton';
import PageHeader from '../Miscellaneous/Text/PageHeader';
import ProfileDisplay from '../Miscellaneous/Images/ProfileDisplay';
import Navbar from '../Users/Navbar';

const Index = () => {
    const location = useLocation();

    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const groupData = useFetchGroups([authorized, setAuthorized, setSiteError]);
    const userData = useFetchUsers([authorized, setAuthorized, setSiteError]);
    const loggedData = useFetchLogged([authorized, setAuthorized, setSiteError])

    const index_arr = location.pathname.includes('groups') ? groupData.data.groups : userData.data.users;

    return (
        <div>
            <Navbar />
            
            <PageHeader props={location.pathname.includes('groups') ? 'Groups' : 'Users'} />

            <ul className='flex flex-col items-center'>
                {index_arr?.map((item) => {
                    return (
                        <li className='flex justify-around items-center w-2/3'>
                            <ProfileDisplay props={[item, false, 'index']} />

                            {item.title ?
                                <GroupRequestLeaveButton props={[
                                    loggedData.data.logged_user, 
                                    item,
                                    item.members.some((member) => member.id === loggedData.data.logged_user.id)
                                ]} />
                            :
                                <div className='flex flex-col items-center'>
                                    <FriendButton props={item} />

                                    <BlockButton props={item} />
                                </div>
                            }
                        </li>
                    )
                })}
            </ul>
        </div>
    )
};

export default Index;