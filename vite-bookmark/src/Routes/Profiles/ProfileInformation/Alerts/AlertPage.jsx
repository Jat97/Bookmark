import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {useBookStore} from '../../../../Context/bookStore';
import {useCheckNotificationMutation} from '../../../Functions/Mutations/UserMutations';
import {useFetchAlerts, useFetchUsers} from '../../../Functions/Queries/UserQueries';
import {useFetchGroups} from '../../../Functions/Queries/GroupQueries';
import AlertData from './AlertData';
import ProfileBox from '../Accounts/ProfileBox';
import PageHeader from '../../../Miscellaneous/Text/PageHeader';
import NoItems from '../../../Miscellaneous/Text/NoItems';

const AlertPage = () => {
    const location = useLocation();

    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError); 

    const check_mutation = useCheckNotificationMutation(setSiteError);

    const userData = useFetchUsers([authorized, setAuthorized, setSiteError]);
    const groupData = useFetchGroups([authorized, setAuthorized, setSiteError]);
    const alertData = useFetchAlerts([authorized, setAuthorized, setSiteError]);

    const alerts = location.pathname.includes('notifications') ? alertData.data?.notifications : alertData.data?.requests;

    useEffect(() => {
        if(alerts?.some((alert) => alert.checked === false)) {
            check_mutation.mutate();
        }
    }, [alerts]);

    return (
        <div className='flex flex-col items-center m-4 md:relative md:items-start md:w-full'>   
            {alerts.length === 0 ? 
                <NoItems text={`There's nothing here.`} />
            :
                <div className='flex flex-col items-center gap-y-5 md:items-start md:w-full'> 
                    <PageHeader text={location.pathname.includes('notifications') ? 'Notifications' : 'Requests'} />

                    <div className='flex flex-col gap-y-4'>
                        {alerts?.map(alert => {
                            return <AlertData alert={alert} />
                        })}  
                    </div>
                </div>   
            }
        
            <div className='hidden md:fixed md:top-[150px] md:right-[10px] md:flex md:flex-col md:gap-y-5'>
                <ProfileBox 
                    title='Users'
                    profile={null}
                    items={userData.data.users}    
                />

                <ProfileBox 
                    title='Groups'
                    profile={null}
                    items={groupData.data.groups}
                />
            </div>
        </div>
    )
}

export default AlertPage;