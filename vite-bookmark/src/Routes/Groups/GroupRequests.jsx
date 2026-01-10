import {useFetchGroups} from '../Functions/Queries/GroupQueries';
import {useBookStore} from '../../Context/bookStore';
import ProfileDisplay from '../Miscellaneous/Images/ProfileDisplay';
import PageHeader from '../Miscellaneous/Text/PageHeader';
import GroupAcceptRejectButton from '../Buttons/GroupAcceptRejectButton';

const GroupRequests = (props) => {
    const group = props.props;

    return (
        <div>
            <PageHeader props={`${group.requests.length} requests`} />

            {group.requests.map(request => {
                return (
                    <div className='flex justify-around items-center'>
                        <ProfileDisplay props={[request, false, 'index']} />

                        <GroupAcceptRejectButton props={[group, request]} />
                    </div>
                )
            })}
        </div>
    )
}

export default GroupRequests;