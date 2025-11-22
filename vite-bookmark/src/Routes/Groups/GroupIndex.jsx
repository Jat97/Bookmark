import {useFetchLogged} from '../Functions/Queries/UserQueries';
import {useFetchGroups} from '../Functions/Queries/GroupQueries';
import {useBookStore} from '../../Context/bookStore';
import GroupDisplay from './GroupDisplay';
import GroupRequestLeaveButton from '../Buttons/GroupRequestLeaveButton'
import PageHeader from '../Miscellaneous/Text/PageHeader';

const GroupIndex = () => {
    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const loggedData = useFetchLogged([authorized, setAuthorized, setSiteError]);
    const groupData = useFetchGroups([authorized, setAuthorized, setSiteError]);

    return (
        <div>
            <PageHeader props={'All groups'} />

            {groupData.data?.groups?.map(group => {
                const is_member = group.members?.some((user) => user.id === loggedData.data?.logged_user.id);

                return (
                    <div className='flex justify-around items-center'>
                        <GroupDisplay props={[group.group, '']} />

                        <GroupRequestLeaveButton props={[loggedData.data?.logged_user, group.group, is_member]} />
                    </div>
                )
            })}
        </div>    
    )
}

export default GroupIndex;