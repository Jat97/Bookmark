import FriendButton from '../../../Buttons/Profile/User/FriendButton';
import BlockButton from '../../../Buttons/Profile/User/BlockButton';
import GroupRequestLeaveButton from '../../../Buttons/Profile/Group/GroupRequestLeaveButton';
import GroupBanUnbanButton from '../../../Buttons/Profile/Group/GroupBanUnbanButton';
import AcceptButton from '../../../Buttons/Profile/AcceptButton';
import RejectButton from '../../../Buttons/Profile/RejectButton';
import NoItems from '../../../Miscellaneous/Text/NoItems';
import ProfileDisplay from './ProfileDisplay';

const Index = ({logged, items, for_group}) => {
    if(items.length === 0) {
        return (
            <div className='flex flex-col items-center w-full'>
                <NoItems text={`There's nothing here!`} />
            </div>
        )
    }
    else {
        return (
            <ul className='flex flex-col items-center gap-y-5 m-2 w-full'>
                {items?.map((item) => {
                    return (
                        <li className='grid grid-cols-2 items-center gap-x-5 m-1 md:h-full md:w-full'>
                            <ProfileDisplay profile={item} is_logged={false} profile_mode={'index'} />

                            {((item.members && item.moderator.id !== logged.profile?.id) && !is_guest) &&
                                <GroupRequestLeaveButton logged={logged} group={item} />    
                            }

                            {is_guest ? 
                                null 
                            : 
                                (for_group && logged.requests.some((request) => request.id === item.id)) ?
                                    <div className='flex justify-around items-center gap-x-5 md:gap-x-10'>
                                        <AcceptButton user={item} group={logged} />

                                        <RejectButton user={item} group={logged} />
                                    </div>   
                                :
                                    logged.requests?.some((request) => request.id !== item.id) &&
                                        <GroupBanUnbanButton group={logged} member={item} />
                            }

                            {((!logged.title && !item.title && logged.profile?.id !== item.id) && !is_guest) &&
                                <div className='flex justify-around items-center gap-x-5 w-full md:gap-x-10'>
                                    <FriendButton logged={logged} user={item} />

                                    <BlockButton logged={logged} user={item} />
                                </div>
                            }
                        </li>
                    )
                })}
            </ul>
        )
    }
};

export default Index;