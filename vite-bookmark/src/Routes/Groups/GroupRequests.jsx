import {useParams} from 'react-router-dom';
import {useFetchGroups} from '../Functions/Queries/GroupQueries';
import {bookStore} from '../../Context/bookStore';
import UserDisplay from '../Users/UserDisplay';
import PageHeader from '../Miscellaneous/Text/PageHeader';
import GroupAcceptRejectButton from '../Buttons/GroupAcceptRejectButton';

const GroupRequests = () => {
    const {groupid} = useParams();

    const authorized = bookStore((state) => state.authorized);
    const setAuthorized = bookStore((state) => state.setAuthorized);
    const setSiteError = bookStore((state) => state.setSiteError);

    const groupData = useFetchGroups([authorized, setAuthorized, setSiteError]);
    const selected_group = groupData.data.find(group => group.group.id === groupid);

    return (
        <div>
            <PageHeader props={`${selected_group.requests.length} requests`} />

            {selected_group.requests.map(request => {
                return (
                    <div>
                        <UserDisplay props={[request, '']} />

                        <GroupAcceptRejectButton props={[selected_group, request]} />
                    </div>
                )
            })}
        </div>
    )
}

export default GroupRequests;