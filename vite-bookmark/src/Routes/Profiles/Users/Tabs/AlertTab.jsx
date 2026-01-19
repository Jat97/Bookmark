import {useState} from 'react';
import AcceptButton from '../../../Buttons/Profile/AcceptButton';
import RejectButton from '../../../Buttons/Profile/RejectButton';
import ProfileDisplay from '../../ProfileInformation/ProfileDisplay';
import {XMarkIcon} from '@heroicons/react/24/solid';

const AlertTab = ({alerts}) => {
    const [alertView, setAlertView] = useState(false);

    const toggleAlertView = () => {
        setAlertView(alertView ? false : true);
    }

    return (
        <div className='absolute border border-slate-200 bg-slate-200/50 max-h-screen max-w-screen 
            md:left-[115px] md:bg-orange-200 md:max-h-60 md:max-w-32'>
            {alertView &&
                <XMarkIcon className='h-6 fill-slate-400 md:hidden hover:fill-zinc-100' onClick={() => toggleAlertView()}/> 
            }

            <div>
               {alerts?.map(alert => {
                    if(alert.requesting_user) {
                        return (
                            <div className='flex justify-around items-center'>
                               <ProfileDisplay props={[alert.requesting_user, false, 'index']} />

                               <div className='flex justify-around items-center'>
                                    <AcceptButton props={alert.requesting_user} />

                                    <RejectButton props={alert.requesting_user} /> 
                               </div>
                            </div>   
                        )
                    }
                    else {
                        return (
                            <div className='flex flex-col items-start'>
                                <ProfileDisplay props={[
                                    alert.alerting_user ? alert.alerting_user : alert.alerting_group,
                                    false,
                                    'index'
                                    ]} />

                                <div className='flex justify-between items-center'>
                                    <p className='text-sm'> {alert?.text} </p>
                                    <p className='text-xs text-gray-200'> {alert?.sent} </p>
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