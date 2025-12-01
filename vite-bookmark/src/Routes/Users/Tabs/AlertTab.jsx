import {useState} from 'react';
import {useAcceptRequestMutation, useRejectRequestMutation} from '../../Functions/Mutations/FriendMutations';
import UserDisplay from '../UserDisplay';
import GroupDisplay from '../../Groups/GroupDisplay';
import AcceptButton from '../../Buttons/AcceptButton';
import RejectButton from '../../Buttons/RejectButton';
import {XMarkIcon} from '@heroicons/react/24/solid';

const AlertTab = (props) => {
    const alerts = props.props;

    const [alertView, setAlertView] = useState(false);

    const friend_accept_mutation = useAcceptRequestMutation();
    const reject_friend_mutation = useRejectRequestMutation();

    const toggleAlertView = () => {
        setAlertView(alertView ? false : true);
    }

    const acceptRequest = () => {
        return friend_accept_mutation.mutate();
    }
    
    const rejectRequest = () => {
        return reject_friend_mutation.mutate();
    }

    return (
        <div className='border border-slate-200 bg-slate-200 max-h-screen max-w-screen md:max-h-60 md:max-w-32'>
            {alertView &&
                <XMarkIcon className='h-6 fill-slate-400 hover:fill-zinc-100' onClick={() => toggleAlertView()}/> 
            }

            <div>
               {alerts.map(alert => {
                    if(alert.requesting_user) {
                        return (
                            <div className='flex justify-around items-center'>
                               <UserDisplay props={[alert.requesting_user, '']} />

                               <div className='flex justify-around items-center'>
                                    <AcceptButton props={[alert.requesting_user.id, acceptRequest]} />

                                    <RejectButton props={[alert.requesting_user.id, rejectRequest]} /> 
                               </div>
                            </div>   
                        )
                    }
                    else {
                        return (
                            <div className='flex flex-col items-start'>
                                {alert.alerting_user ? 
                                    <UserDisplay props={[alert.alerting_user, '']} />
                                :
                                    <GroupDisplay props={[alert.alerting_group, '']} />
                                }

                                <div className='flex justify-between items-center'>
                                    <p className='text-sm'> {alert.text} </p>
                                    <p className='text-xs text-gray-200'> {alert.sent} </p>
                                </div>
                            </div>
                        )
                    }
               })}  
            </div>

            {!alertView &&
                <div> View all alerts </div>
            }
        </div>
    )
}

export default AlertTab;