import ProfileDisplay from '../../Miscellaneous/Images/ProfileDisplay';
import PageHeader from '../../Miscellaneous/Text/PageHeader';
import AcceptButton from '../Buttons/AcceptButton';
import RejectButton from '../Buttons/RejectButton';

const GroupRequests = ({group}) => { 
   return (
        <div className='flex flex-col items-center'>
            <PageHeader headers={`${group.requests.length} requests`} />

            {group.requests.map(request => {
                return (
                    <div className='flex justify-around items-center'>
                        <ProfileDisplay profile={request} is_logged={false} profile_mode={'index'} />

                        <div className='flex justify-around items-center'>
                            <AcceptButton user_group={request} />

                            <RejectButton user_group={request} />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default GroupRequests;