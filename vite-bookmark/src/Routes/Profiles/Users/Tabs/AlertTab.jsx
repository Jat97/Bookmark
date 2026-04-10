import {Link} from 'react-router-dom';
import AlertData from '../../../Profiles/ProfileInformation/Alerts/AlertData';
import NoItems from '../../../Miscellaneous/Text/NoItems';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const AlertTab = ({alerts}) => {
    return (
        <div className={`absolute top-0 left-0 flex flex-col items-center bg-slate-200
            h-screen w-screen z-20 md:bg-yellow-300 md:top-[30px] 
                md:left-[-100px] md:overflow-y-auto md:gap-3 md:max-h-60 md:max-w-[275px] md:z-50`}>
        
            {alerts.length === 0 &&
                <NoItems text={`There's nothing here.`} />
            }

            <div>
               {alerts?.slice(0, 4).map(alert => {
                    return <AlertData alert={alert} />
               })}  
            </div>

            {(alerts.length > 4) &&
                <Link to={`/api/${alerts.some((alert) => alert.requesting_user) ? 'requests' : 'notifications'}`} 
                    className='cursor-pointer text-blue-600 hover:underline'> 
                    View all {alerts.some((alert) => alert.requesting_user) ? 'requests' : 'notifications'}
                </Link>
            }
        </div>
    )
}

export default AlertTab;