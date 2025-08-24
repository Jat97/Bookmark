import {useState} from 'react';
import UserDisplay from '../UserDisplay';
import GroupDisplay from '../../Groups/GroupDisplay';
import {FriendRequestButtons} from '../../Buttons/FriendRequestButtons';
import {XMarkIcon} from '@heroicons/react/24/solid';

const AlertTab = (props) => {
    const alerts = props.props;

    const [alertView, setAlertView] = useState(false);

    const toggleAlertView = () => {
        setAlertView(alertView ? false : true);
    }

    return (
        <div>
            {alertView &&
                <div onClick={() => toggleAlertView}>
                   <XMarkIcon className='h-6' /> 
                </div> 
            }

            <div>
               {alerts.map(alert => {
                    if(alert.requesting_user) {
                        return (
                            <div>
                               <UserDisplay props={[alert.requesting_user, '']} />

                               <FriendRequestButtons props={alert.requesting_user} />
                            </div>   
                        )
                    }
                    else {
                        return (
                            <div>
                                {alert.alerting_user ? 
                                    <UserDisplay props={[alert.alerting_user, '']} />
                                :
                                    <GroupDisplay props={[alert.alerting_group, '']} />
                                }

                                <div>
                                    <p> {alert.text} </p>
                                    <p> {alert.sent} </p>
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