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
            md:top-[30px] md:left-[-25px] md:bg-amber-300/50 md:max-h-80 md:w-[250px]'>
            {alertView &&
                <XMarkIcon className='h-6 fill-slate-400 md:hidden hover:fill-zinc-100' onClick={() => toggleAlertView()}/> 
            }

            <div>
               {alerts?.map(alert => {
                    <div className={`flex items-center ${alert.requesting_user ? 'justify-around' : 'flex-col'}`}>
                        <ProfileDisplay 
                        profile={alert.requesting_user ? alert.requesting_user : alert.alerting_user ? alert.alerting_user : alert.alerting_group} 
                        is_logged={false}
                        profile_mode={'index'} />

                        {alert.requesting_user &&
                            <div className='flex justify-around items-center'>
                                <AcceptButton props={alert.requesting_user} />

                                <RejectButton props={alert.requesting_user} /> 
                            </div>
                        }

                        {(alert.alerting_user || alert.alerting_group) &&
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
                        }
                    </div>
               })}  
            </div>

            {!alertView &&
                <p> View all alerts </p>
            }
        </div>
    )
}

export default AlertTab;