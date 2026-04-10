import ProfileDisplay from '../Accounts/ProfileDisplay';
import AcceptButton from '../../../Buttons/Profile/AcceptButton';
import RejectButton from '../../../Buttons/Profile/RejectButton';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const AlertData = ({alert}) => {
    return (
       <div className='flex flex-col items-start'>
            <div className='grid grid-col-2 items-start border border-red-200 md:item-center'>
                <div className='flex justify-between items-center'>
                    <ProfileDisplay 
                        profile={alert.alerting_user} 
                        is_logged={false}
                        profile_mode={'alert'} 
                    />
                    
                    <span className='text-xs text-gray-200 w-[100px] md:text-sm'> {dayjs().to(alert?.sent)} </span>
                </div>

                {alert.requesting_user &&
                    <div className='flex justify-around items-center gap-x-2'>
                        <AcceptButton user={alert.requesting_user} for_group={false} />

                        <RejectButton user={alert.requesting_user} for_group={false} /> 
                    </div>
                }

                {alert.text &&
                    <div className='flex flex-col items-start truncate'>
                        <div className='flex justify-between items-center gap-x-10'>
                            <span className='text-xs md:text-sm'> {alert?.text} </span>
                            <span className='text-xs md:text-sm' dangerouslySetInnerHTML={{__html: alert.post.text}} />
                        </div>
                    </div>
                }
            </div>
        </div> 
    )
};

export default AlertData;