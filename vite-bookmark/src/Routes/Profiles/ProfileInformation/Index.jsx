import {useLocation} from 'react-router-dom';
import FriendButton from '../../Buttons/FriendButton';
import BlockButton from '../../Buttons/BlockButton';
import GroupRequestLeaveButton from '../../Buttons/GroupRequestLeaveButton';
import AcceptButton from '../../Buttons/AcceptButton';
import RejectButton from '../../Buttons/RejectButton';
import PageHeader from '../../Miscellaneous/Text/PageHeader';
import NoItems from '../../Miscellaneous/Text/NoItems';
import ProfileDisplay from './ProfileDisplay';

const Index = ({logged, moderator, items}) => {
    const location = useLocation();

    return (
        <div> 
            {location.pathname.includes('groups') || location.pathname.includes('users') &&
                <PageHeader header={location.pathname.includes('groups') ? 'Groups' : 'Users'} />
            }           
            
            {items.length === 0 ?
                <NoItems text={`There's nothing here!`} />
            :
                <ul className='flex flex-col items-center'>
                    {items?.map((item) => {
                        return (
                            <li className='flex justify-around items-center w-2/3'>
                                <ProfileDisplay profile={item} is_logged={false} profile_mode={'index'} />

                                {item.title && logged ?
                                    <GroupRequestLeaveButton logged={logged} group={item} 
                                        is_member={item.members.some((member) => member.id === logged.id)}
                                    />
                                :
                                    item.title && moderator ?
                                        <div>
                                            <AcceptButton user_group={item} />

                                            <RejectButton user_group={item} />
                                        </div>
                                    :
                                        <div className='flex flex-col items-center'>
                                            <FriendButton user={item} />

                                            <BlockButton user={item} />
                                        </div>
                                }
                            </li>
                        )
                    })}
                </ul>
            }
        </div>
    )
};

export default Index;