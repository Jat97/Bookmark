import {useState} from 'react';
import AcceptButton from '../../../Buttons/Profile/AcceptButton';
import RejectButton from '../../../Buttons/Profile/RejectButton';
import ProfileDisplay from '../../ProfileInformation/ProfileDisplay';
import NoItems from '../../../Miscellaneous/Text/NoItems';
import {XMarkIcon} from '@heroicons/react/24/solid';

const AlertTab = ({alerts}) => {
    const [alertView, setAlertView] = useState(false);

    const toggleAlertView = () => {
        setAlertView(alertView ? false : true);
    }

    return (
        <div className={`absolute flex flex-col items-center bg-slate-200
            max-h-screen max-w-screen md:bg-yellow-300 md:top-[30px] 
                md:left-[-100px] md:gap-3 md:max-h-80 md:w-[250px]
            ${alertView && 'bg-slate-200/50'}`}>
            {alertView &&
                <XMarkIcon className='h-6 fill-slate-400 md:hidden hover:fill-zinc-100' 
                    {...(alertView && {onClick: toggleAlertView})}/> 
            }

            {alerts.length === 0 &&
                <NoItems text={`There's nothing here.`} />
            }

            <div className={`${alertView && 'border border-slate-200'}`}>
               {alerts?.map(alert => {
                    return (
                        <div className='flex flex-col items-center'>
                            <ProfileDisplay 
                            profile={alert} 
                            is_logged={false}
                            profile_mode={'index'} />

                            {alert.first_name &&
                                <div className='flex justify-around items-center gap-x-2'>
                                    <AcceptButton user_group={alert} />

                                    <RejectButton user_group={alert} /> 
                                </div>
                            }

                            {alert.text &&
                                <div className='flex flex-col items-start'>
                                    <div className='flex justify-between items-center'>
                                        <p className='text-sm'> {alert?.text} </p>
                                        <p className='text-xs text-gray-200'> {alert?.sent} </p>
                                    </div>
                                </div>
                            }
                        </div>
                    )
               })}  
            </div>

            {(!alertView && alerts.length > 0) &&
                <p className='cursor-pointer text-blue-600 hover:underline' onClick={() => toggleAlertView()}> 
                    View all alerts 
                </p>
            }
        </div>
    )
}

export default AlertTab;