import {useLocation, useParams} from 'react-router-dom';
import {useBookStore} from '../../../../Context/bookStore';
import {useFetchLogged, useFetchUsers} from '../../../Functions/Queries/UserQueries';
import {useFetchGroups} from '../../../Functions/Queries/GroupQueries';
import Index from './Index';
import ProfileBox from './ProfileBox';
import PageHeader from '../../../Miscellaneous/Text/PageHeader';
import AllProfileLoad from '../../../Miscellaneous/Loading/Profiles/ProfileInformation/AllProfileLoad';

const AllProfiles = () => {
    const location = useLocation();
    const {profileid} = useParams(); 

    const is_group = useBookStore((state) => state.is_group);
    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const loggedData = !is_group && useFetchLogged([authorized, setAuthorized, setSiteError]);
    const userData = useFetchUsers([authorized, setAuthorized, setSiteError]);
    const groupData = useFetchGroups([authorized, setAuthorized, setSiteError]);

    const selected_group = location.pathname.includes('requests') && groupData.data?.groups.find(group => group.id.toString() === profileid);
    const selected_user = userData.data?.users.find(user => user.id.toString() === profileid);

    const reg = new RegExp(location.params, 'i');

    const members = selected_group?.members;
    
    const requests = selected_group?.requests;

    const friends = loggedData.data?.profile.id.toString() === profileid ? 
        loggedData.data?.friends : selected_user?.friends;

    const searched_users = location.params && 
        userData.data.filter(user => reg.test(user.first_name) || reg.test(user.last_name));

    if(userData.isPending || groupData.isPending) {
        return <AllProfileLoad />
    }
    else {
        return (
            <div className='flex flex-col items-center gap-y-4'>
                <PageHeader header={`${
                    location.pathname.includes('groups') ? 'Groups' : 
                    location.pathname.includes('members') ? 'Members' :
                    location.pathname.includes('friends') ? 'Friends' :
                    location.pathname.includes('requests') ? 'Requests' :
                    location.params ? `Results for ${location.params}` :
                    'Users'
                }`}/>

                <div className='md:relative md:flex md:justify-between md:items-start md:w-2/3'>
                    <Index 
                        logged={selected_group ? selected_group : loggedData.data} 
                        items={
                            location.pathname.includes('groups') ? groupData.data?.groups : 
                            location.pathname.includes('members') ? members :
                            location.pathname.includes('requests') ? requests :
                            location.pathname.includes('friends') ? friends :
                            location.params ? searched_users :
                            userData.data?.users
                        }
                        for_group={selected_group?.moderator?.id === loggedData.data?.profile.id}
                        is_group={is_group}
                    />

                    <div className='hidden md:fixed md:top-[150px] md:right-[10px] md:flex md:flex-col md:gap-y-10'>
                        <ProfileBox 
                            title='Users' 
                            profile={loggedData.data.profile}
                            items={userData.data.users.filter(user => !loggedData.data.friends.some((friend) => friend.id === user.id))} 
                        />

                        <ProfileBox 
                            title='Groups'
                            profile={loggedData.data.profile}
                            items={groupData.data.groups}
                        />
                    </div>
                </div>
            </div>
        )
    }
};

export default AllProfiles;