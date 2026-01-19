import {useLocation} from 'react-router-dom';
import {useBookStore} from '../../../Context/bookStore';
import {useFetchUsers} from '../../Functions/Queries/UserQueries';
import {useFetchGroups} from '../../Functions/Queries/GroupQueries';
import Index from './Index';
import PageHeader from '../../Miscellaneous/Text/PageHeader';

const AllProfiles = () => {
    const location = useLocation();

    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const userData = useFetchUsers([authorized, setAuthorized, setSiteError]);
    const groupData = useFetchGroups([authorized, setAuthorized, setSiteError]);

    return (
        <div>
            <PageHeader header={`${location.pathname.includes('groups') ? 'Groups' : 'Users'}`} />

            <Index 
                logged={null} 
                moderator={null} 
                items={location.pathname.includes('groups') ? groupData.data.groups : userData.data.users} 
            />
        </div>
    )
};

export default AllProfiles;