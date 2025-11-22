import {useParams} from 'react-router-dom';
import {useFetchGroups} from '../Functions/Queries/GroupQueries';
import {useBookStore} from '../../Context/bookStore';
import UserDisplay from '../Users/UserDisplay';
import PageHeader from '../Miscellaneous/Text/PageHeader';
import GroupAcceptRejectButton from '../Buttons/GroupAcceptRejectButton';

const GroupRequests = () => {
    const {groupid} = useParams();

    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const groupData = useFetchGroups([authorized, setAuthorized, setSiteError]);
    const selected_group = groupData.data.find(group => group.group.id === groupid);

    return (
        <div>
            <PageHeader props={`${selected_group.requests.length} requests`} />

            {selected_group.requests.map(request => {
                return (
                    <div className='flex justify-around items-center'>
                        <UserDisplay props={[request, '']} />

                        <GroupAcceptRejectButton props={[selected_group, request]} />
                    </div>
                )
            })}
        </div>
    )
}

export default GroupRequests;