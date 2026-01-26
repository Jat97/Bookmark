import FriendButton from '../../Buttons/Profile/User/FriendButton';
import BlockButton from '../../Buttons/Profile/User/BlockButton';
import GroupRequestLeaveButton from '../../Buttons/Profile/Group/GroupRequestLeaveButton';
import AcceptButton from '../../Buttons/Profile/AcceptButton';
import RejectButton from '../../Buttons/Profile/RejectButton';
import NoItems from '../../Miscellaneous/Text/NoItems';
import ProfileDisplay from './ProfileDisplay';

const Index = ({logged, items}) => {
    return (
        <div> 
            {items?.length === 0 ?
                <NoItems text={`There's nothing here!`} />
            :
                <ul className='flex flex-col items-center'>
                    {items?.map((item) => {
                        return (
                            <li className='flex justify-around items-center w-2/3'>
                                <ProfileDisplay profile={item} is_logged={false} profile_mode={'index'} />

                                {item?.moderator.id === logged?.id ?
                                    <div className='flex flex-col items-center'>
                                        <AcceptButton user_group={item} />

                                        <RejectButton user_group={item} />
                                    </div>
                                :
                                    <GroupRequestLeaveButton logged={logged} group={item} 
                                        is_member={item.members.some((member) => member.id === logged?.id)}
                                    />
                                }

                                {!item.title &&
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